package com.example.kioskapplication.KIOSKSCREEN.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_item")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String itemName;
    private double itemPrice;
    private int quantity;
    private char itemSize;
    private double subtotal;
    private Long menuItemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private CustomerOrder customerOrder;

    public OrderItem(MenuItem menuItem, int quantity, char itemSize) {
        this.itemName = menuItem.getItemName();
        this.itemPrice = menuItem.getItemPrice();
        this.quantity = quantity;
        this.itemSize = itemSize;
        this.subtotal = this.itemPrice * this.quantity;
        this.menuItemId = menuItem.getItemId();
    }

}
