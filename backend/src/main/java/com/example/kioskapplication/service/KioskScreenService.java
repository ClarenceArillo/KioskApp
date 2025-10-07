package com.example.kioskapplication.service;

import com.example.kioskapplication.model.*;
import com.example.kioskapplication.model.MenuItem;
import com.example.kioskapplication.repository.CustomerOrdersRepository;
import com.example.kioskapplication.repository.MenuItemRepository;
import jakarta.transaction.Transactional;
import lombok.Getter;
import org.aspectj.weaver.ast.Or;
import org.springframework.stereotype.Service;
import java.awt.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
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


    @Override
    public List <MenuItem> getAllMenuItemsPerCategory(MenuItemCategory category) {
        if(!isOrderStarted() || orderType == null){
            throw new IllegalStateException("Please start an order to view the menu.");
        }
        return menuItemRepository.findByItemCategorySelected(category);
    }

    //Kiosk Functionalities.
    @Override
    public List<MenuItem> addMenuItemtoCart(MenuItem menuItem) {
        cartItems.add(menuItem);
        return cartItems;
    }

    @Override
    public boolean removeMenuItemFromCart(Long id) {
        return cartItems.removeIf(item -> item.getItemId()==(id));
    }

    @Override
    public String updateMenuItemInCart(Long id, char size, int quantity) {
        for (MenuItem item : cartItems) {
            if (item.getItemId() == id) {
                item.setItemSize(size);
                item.setItemQuantity(quantity);
                ;
            }
        }
        return "Item updated successfully (Size: " + size + ", Quantity: " + quantity + ")";
    }

    @Override
    public List<MenuItem> viewCart() {
        return cartItems;
    }

    @Override
    public void checkout() {
        if(cartItems.isEmpty()){
            throw new IllegalStateException("Cart is empty. Please add items to cart before checkout.");
        }else{
            this.isCheckout = true;
        }
    }

    @Override
    public void cancelOrder(OrderStatus orderStatus) {
        this.orderStatus = OrderStatus.CANCELLED;

        if(orderStatus == null || orderStatus == OrderStatus.CANCELLED){
            cartItems.clear();
            this.orderStarted = false;
            this.orderType = null;
            this.isCheckout = false;
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
                "Kiosk Restaurant",
                "123 Food Street, City, State 12345",
                "(555) 123-4567",
                "info@kioskrestaurant.com",
                "/images/logo.png"
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
