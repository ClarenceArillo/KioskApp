package com.example.kioskapplication.KIOSKSCREEN.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer_order")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrder {

//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer orderId; //DB ID

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @SequenceGenerator(name = "order_seq", sequenceName = "order_seq", initialValue = 10000, allocationSize = 1)
    private Integer orderId;

    //private int orderId; // Order number shown to user on receipt and screen

    @Enumerated(EnumType.STRING)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus; // PENDING, PREPARING, NOW_SERVING, DONE, CANCELLED

    private boolean isOrderStarted = false; // to flip to "true" when order is being prepared
    private boolean isPaid = false; // to flip to "true" when user pays
    private boolean isCheckout = false; // to flip to "true" when user checks out
    private double totalPrice;
    private LocalDateTime orderDateTime;

    @OneToMany(cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private List<OrderItem> orderItems = new ArrayList<>();


    // Helper method to add items
    public void addOrderItem(OrderItem item) {
        this.orderItems.add(item);
    }


}
