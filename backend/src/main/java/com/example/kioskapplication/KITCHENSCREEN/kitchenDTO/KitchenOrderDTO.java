package com.example.kioskapplication.KITCHENSCREEN.kitchenDTO;

import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderType;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public class KitchenOrderDTO {
    private Integer orderId;
    private OrderType orderType;
    private OrderStatus orderStatus;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime orderDateTime;

    private double totalPrice;
    private List<KitchenOrderItemDTO> orderItems;

    // Constructors
    public KitchenOrderDTO() {}

    public KitchenOrderDTO(Integer orderId, OrderType orderType, OrderStatus orderStatus,
                           LocalDateTime orderDateTime, double totalPrice, List<KitchenOrderItemDTO> orderItems) {
        this.orderId = orderId;
        this.orderType = orderType;
        this.orderStatus = orderStatus;
        this.orderDateTime = orderDateTime;
        this.totalPrice = totalPrice;
        this.orderItems = orderItems;
    }

    // Getters and Setters
    public Integer getOrderId() { return orderId; }
    public void setOrderId(Integer orderId) { this.orderId = orderId; }

    public OrderType getOrderType() { return orderType; }
    public void setOrderType(OrderType orderType) { this.orderType = orderType; }

    public OrderStatus getOrderStatus() { return orderStatus; }
    public void setOrderStatus(OrderStatus orderStatus) { this.orderStatus = orderStatus; }

    public LocalDateTime getOrderDateTime() { return orderDateTime; }
    public void setOrderDateTime(LocalDateTime orderDateTime) { this.orderDateTime = orderDateTime; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public List<KitchenOrderItemDTO> getOrderItems() { return orderItems; }
    public void setOrderItems(List<KitchenOrderItemDTO> orderItems) { this.orderItems = orderItems; }
}
