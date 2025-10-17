package com.example.kioskapplication.KIOSKSCREEN.service;

import com.example.kioskapplication.KIOSKSCREEN.model.*;
import com.example.kioskapplication.KIOSKSCREEN.model.MenuItem;
import com.example.kioskapplication.KIOSKSCREEN.repository.CustomerOrdersRepository;
import com.example.kioskapplication.KIOSKSCREEN.repository.MenuItemRepository;
import com.example.kioskapplication.KITCHENSCREEN.controller.KitchenController;
import com.example.kioskapplication.KITCHENSCREEN.service.KitchenService;
import jakarta.transaction.Transactional;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class KioskScreenService implements KioskService{

    //Before Order Screen Functionalities.
    @Getter
    private boolean orderStarted = false;
    private OrderType orderType = null;
    private boolean isCheckout = false;
    private OrderStatus orderStatus = null;
    private boolean isPaid = false;

    @Autowired
    private KitchenService kitchenService;

    private final MenuItemRepository menuItemRepository;
    private final CustomerOrdersRepository customerOrdersRepository;
    public KioskScreenService(MenuItemRepository menuItemRepository, CustomerOrdersRepository customerOrdersRepository) {
        this.customerOrdersRepository = customerOrdersRepository;
        this.menuItemRepository = menuItemRepository;
    }

    private final List<MenuItem> cartItems = new ArrayList<>();

    @Override
    public void startOrder() {
        this.orderStarted = true;
        this.orderType = null;
        this.isCheckout = false;
        this.isPaid = false;
        this.orderStatus = OrderStatus.PENDING;
    }

    @Override
    public void setOrderType(OrderType orderType) {
        if(isOrderStarted()) {
            this.orderType = orderType;
        }else {
            // Handle the case where the order has not started yet
            throw new IllegalStateException("Order has not started yet. Please start an order first.");
        }
    }

    @Override
    public OrderType getOrderType() {
        return orderType;
    }

    //Screen Statics
    @Override
    public List<MenuItemCategory> getMenuItemCategories() {
        if(!isOrderStarted()){
            throw new IllegalStateException("Please start an order to view the menu.");
        }
        if(orderType == null){
            throw new IllegalStateException("Please select an order type to view the menu.");
        }
        return List.of(MenuItemCategory.values());
    }

    //Kiosk Functionalities.
    @Override
    public List<MenuItem> getAllMenuItemsPerCategory(MenuItemCategory category, String sortOrder) {
        if (!isOrderStarted() || orderType == null) {
            throw new IllegalStateException("Please start an order to view the menu.");
        }

        List<MenuItem> items = menuItemRepository.findByItemCategorySelected(category);

        switch (sortOrder.toLowerCase()) {
            case "asc" ->
                    items.sort(Comparator.comparingDouble(MenuItem::getItemPrice)); // ascending
            case "desc" ->
                    items.sort(Comparator.comparingDouble(MenuItem::getItemPrice).reversed()); // descending
            case "default" -> {
                // do nothing, retain DB/default declaration order
            }
            default -> throw new IllegalArgumentException("Invalid sortOrder. Use 'asc', 'desc', or 'default'.");
        }

        return items;
    }

    public List<MenuItem> addMenuItemToCartByCategoryAndId(MenuItemCategory category, Integer itemId) {
        if (!isOrderStarted() || orderType == null) {
            throw new IllegalStateException("Please start an order and select order type before adding items.");
        }

        // ✅ Fetch the item safely from repository
        MenuItem menuItem = menuItemRepository
                .findByItemIdAndItemCategorySelected(itemId, category)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Menu item not found for category " + category + " and ID " + itemId));

        // ✅ Add it to the cart
        cartItems.add(menuItem);
        return cartItems;
    }


    public MenuItem getMenuItemById(Long itemId) {
        return menuItemRepository.findById(itemId.intValue())
                .orElseThrow(() -> new IllegalArgumentException("Menu item not found with ID: " + itemId));
    }

    @Override
    public List<MenuItem> addMenuItemtoCart(MenuItem menuItem) {
        if (!isOrderStarted() || orderType == null) {
            throw new IllegalStateException("Please start an order and select order type before adding items.");
        }
        cartItems.add(menuItem);
        return cartItems;
    }

    @Override
    public boolean removeMenuItemFromCart(Long id) {
        return cartItems.removeIf(item -> item.getItemId()==(id));
    }

    @Override
    public String updateMenuItemInCart(Long id, char size, int quantity) {
        MenuItem item = cartItems.stream()
                .filter(i -> i.getItemId()== id.longValue())
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Item not found in cart"));
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be greater than zero");
        item.setItemSize(size);
        item.setItemQuantity(quantity);
        return "Updated: " + item.getItemName();
    }

    @Override
    public List<MenuItem> viewCart() {
        return cartItems;
    }

    @Override
    public void checkout() {
        if(cartItems.isEmpty()){
            throw new IllegalStateException("Cart is empty. Please add items to cart before checkout.");
        }else if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }else{
            this.isCheckout = true;
        }
    }

    @Override
    public void cancelOrder(OrderStatus orderStatus) {
        this.orderStatus = OrderStatus.CANCELLED;

        if(orderStatus == null || orderStatus == OrderStatus.CANCELLED){
            this.cartItems.clear();
            this.orderStarted = false;
            this.orderType = null;
            this.isCheckout = false;
            this.isPaid = false;
        }else{
            throw new IllegalStateException("Order cannot be cancelled at this stage.");
        }
    }

    @Override
    @Transactional
    public Integer payOrder(){
        if(!isCheckout){
            throw new IllegalStateException("Please checkout before making a payment.");
        }else{
            this.orderStatus = OrderStatus.PENDING;
            this.isPaid = true;
            CustomerOrder savedOrder = saveOrderToDatabase();
            kitchenService.notifyKitchen(savedOrder);
            return savedOrder.getOrderId();
        }
    }

    private CustomerOrder saveOrderToDatabase() {
        double totalPrice = cartItems.stream()
                .mapToDouble(item -> item.getItemPrice() * item.getItemQuantity())
                .sum();

        // Convert cart items to OrderItem entities
        List<OrderItem> orderItems = cartItems.stream()
                .map(item -> new OrderItem(
                        item, // Use the MenuItem constructor
                        item.getItemQuantity(),
                        item.getItemSize()
                ))
                .collect(Collectors.toList());

        CustomerOrder order = new CustomerOrder();
        order.setOrderType(orderType);
        order.setOrderStatus(OrderStatus.PENDING); // Set explicitly
        order.setOrderDateTime(LocalDateTime.now()); // Use correct field name
        order.setTotalPrice(totalPrice);
        order.setPaid(true); // Use correct field name
        order.setCheckout(true); // Use correct field name
        order.setOrderStarted(true);

        // Add all order items
        orderItems.forEach(order::addOrderItem);

        // Save to database - NOT static call!
        return customerOrdersRepository.save(order);
    }

    public ReceiptDTO receiptPrintout(Integer orderId) {
        if (!isCheckout || !isPaid) {
            throw new IllegalStateException("Cannot print receipt: Order not yet paid or checked out.");
        }

        // Get the latest order from database
        CustomerOrder latestOrder = customerOrdersRepository.findByOrderId(orderId)
                .orElseThrow(() -> new IllegalStateException("No order found in database with ID: " + orderId));

        // Convert OrderItem to ReceiptItemDTO
        List<ReceiptItemDTO> receiptItems = latestOrder.getOrderItems().stream()
                .map(item -> new ReceiptItemDTO(
                        item.getItemName(),
                        item.getItemPrice(),
                        item.getQuantity(),
                        item.getItemSize(),
                        item.getSubtotal()
                ))
                .collect(Collectors.toList());

        return new ReceiptDTO(
                latestOrder.getOrderId(), // This is your database ID starting from 10000
                latestOrder.getOrderType(),
                latestOrder.getOrderDateTime(), // Use correct getter
                latestOrder.getTotalPrice(),
                receiptItems,
                "AYA",
                "Makati Avenue, Poblacion, Makati City",
                " (+63) 927-531-4820",
                "ayamnl@gmail.com",
                "/images/Logo.png"
        );

    }

    // Add this method to clear cart after receipt is generated
    @Transactional
    public void completeOrder() {
        // Clear cart and reset state after receipt is generated
        this.cartItems.clear();
        this.orderStarted = false;
        this.orderType = null;
        this.isCheckout = false;
        this.isPaid = false;
        this.orderStatus = null;
    }



}
