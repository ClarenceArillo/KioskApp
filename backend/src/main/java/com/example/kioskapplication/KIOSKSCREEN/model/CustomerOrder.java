package com.example.kioskapplication.KIOSKSCREEN.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "customer_order")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
    @SequenceGenerator(name = "order_seq", sequenceName = "order_seq", initialValue = 10000, allocationSize = 1)
    private Integer orderId;

    @Enumerated(EnumType.STRING)
    private OrderType orderType;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    private boolean isOrderStarted = false;
    private boolean isPaid = false;
    private boolean isCheckout = false;
    private double totalPrice;
    private LocalDateTime orderDateTime;

    @OneToMany(mappedBy = "customerOrder", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    // ✅ Helper method to set both sides
    public void addOrderItem(OrderItem item) {
        item.setCustomerOrder(this);
        this.orderItems.add(item);
    }

}
