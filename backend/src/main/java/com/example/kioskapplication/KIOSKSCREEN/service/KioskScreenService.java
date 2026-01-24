package com.example.kioskapplication.KIOSKSCREEN.service;

import com.example.kioskapplication.KIOSKSCREEN.model.*;
import com.example.kioskapplication.KIOSKSCREEN.repository.CustomerOrdersRepository;
import com.example.kioskapplication.KIOSKSCREEN.repository.MenuItemRepository;
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
public class KioskScreenService implements KioskService {

    // Before Order Screen Functionalities.
    @Getter
    private boolean orderStarted = false;
    private OrderType orderType = null;
    private boolean isCheckout = false;
    private OrderStatus orderStatus = null;
    private boolean isPaid = false;

    private final MenuItemRepository menuItemRepository;
    private final CustomerOrdersRepository customerOrdersRepository;
    private final KitchenService kitchenService;

    @Autowired
    public KioskScreenService(MenuItemRepository menuItemRepository,
                              CustomerOrdersRepository customerOrdersRepository,
                              KitchenService kitchenService) {
        this.menuItemRepository = menuItemRepository;
        this.customerOrdersRepository = customerOrdersRepository;
        this.kitchenService = kitchenService;
    }

    private final List<MenuItem> cartItems = new ArrayList<>();

    @Override
    public void startOrder() {
        this.cartItems.clear();
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
        } else {
            throw new IllegalStateException("Order has not started yet. Please start an order first.");
        }
    }

    @Override
    public OrderType getOrderType() {
        return orderType;
    }

    // Screen Statics
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

    // Kiosk Functionalities.
    @Override
    public List<MenuItem> getAllMenuItemsPerCategory(MenuItemCategory category, String sortOrder) {
        if (!isOrderStarted() || orderType == null) {
            throw new IllegalStateException("Please start an order to view the menu.");
        }

        List<MenuItem> items = menuItemRepository.findByItemCategorySelected(category);

        switch (sortOrder.toLowerCase()) {
            case "asc" -> items.sort(Comparator.comparingDouble(MenuItem::getItemPrice));
            case "desc" -> items.sort(Comparator.comparingDouble(MenuItem::getItemPrice).reversed());
            case "default" -> {
                // do nothing, retain DB/default declaration order
            }
            default -> throw new IllegalArgumentException("Invalid sortOrder. Use 'asc', 'desc', or 'default'.");
        }

        return items;
    }

    public List<MenuItem> addMenuItemToCartByCategoryAndId(MenuItemCategory category, Integer itemId) {
        return addMenuItemToCartByCategoryAndId(category, itemId, 1, 'M');
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
        return cartItems.removeIf(item -> item.getItemId() == id);
    }

    @Override
    public String updateMenuItemInCart(Long id, char size, int quantity) {
        MenuItem item = cartItems.stream()
                .filter(i -> i.getItemId() == id)
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
        } else {
            this.isCheckout = true;
        }
    }

    @Override
    public void cancelOrder(OrderStatus orderStatus) {
        this.orderStatus = OrderStatus.CANCELLED;
        this.cartItems.clear();
        this.orderStarted = false;
        this.orderType = null;
        this.isCheckout = false;
        this.isPaid = false;
    }

    @Override
    @Transactional
    public Integer payOrder() {
        if(!isCheckout) {
            throw new IllegalStateException("Please checkout before making a payment.");
        } else {
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

        CustomerOrder order = new CustomerOrder();
        order.setOrderType(orderType);
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDateTime(LocalDateTime.now());
        order.setTotalPrice(totalPrice);
        order.setPaid(true);
        order.setCheckout(true);
        order.setOrderStarted(true);

        // convert and attach items
        for (MenuItem menuItem : cartItems) {
            OrderItem orderItem = new OrderItem(menuItem, menuItem.getItemQuantity(), menuItem.getItemSize());
            order.addOrderItem(orderItem);
        }

        System.out.println("Saving order with total: " + totalPrice + " and " + order.getOrderItems().size() + " items.");
        return customerOrdersRepository.save(order);
    }

    public ReceiptDTO receiptPrintout(Integer orderId) {
        if (!isCheckout || !isPaid) {
            throw new IllegalStateException("Cannot print receipt: Order not yet paid or checked out.");
        }

        // Get the latest order from database
        CustomerOrder latestOrder = customerOrdersRepository.findById(orderId)
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
                latestOrder.getOrderId(),
                latestOrder.getOrderType(),
                latestOrder.getOrderDateTime(),
                latestOrder.getTotalPrice(),
                receiptItems,
                "Aya sa Hapag - Makati",
                "Makati Avenue, Poblacion, Makati City",
                " (+63) 927-531-4820",
                "ayasahapagmkt@gmail.com",
                "/images/Logo.png"
        );
    }

    // Updated method with quantity and size parameters
    public List<MenuItem> addMenuItemToCartByCategoryAndId(MenuItemCategory category, Integer itemId, int quantity, char size) {
        if (!isOrderStarted() || orderType == null) {
            throw new IllegalStateException("Please start an order and select order type before adding items.");
        }

        MenuItem repoItem = menuItemRepository
                .findByItemIdAndItemCategorySelected(itemId, category)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Menu item not found for category " + category + " and ID " + itemId));

        // Create a new MenuItem instance for the cart
        MenuItem cartItem = new MenuItem();
        cartItem.setItemId(repoItem.getItemId());
        cartItem.setItemName(repoItem.getItemName());
        cartItem.setItemPrice(repoItem.getItemPrice());
        cartItem.setItemDescription(repoItem.getItemDescription());
        cartItem.setItemImageUrl(repoItem.getItemImageUrl());
        cartItem.setItemCategorySelected(repoItem.getItemCategorySelected());
        cartItem.setItemSize(size);
        cartItem.setItemQuantity(quantity);

        cartItems.add(cartItem);
        return cartItems;
    }

    // Add this method to clear cart after receipt is generated
    @Transactional
    public void completeOrder() {
        this.cartItems.clear();
        this.orderStarted = false;
        this.orderType = null;
        this.isCheckout = false;
        this.isPaid = false;
        this.orderStatus = null;
    }
}