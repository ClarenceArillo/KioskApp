package com.example.kioskapplication.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String itemName;
    private double itemPrice;
    private int quantity;
    private char itemSize; // S, M, L
    private double subtotal;

    private Long menuItemId; // Reference to MenuItem's itemId

    public OrderItem(MenuItem menuItem, int quantity, char itemSize) {
        this.itemName = menuItem.getItemName();
        this.itemPrice = menuItem.getItemPrice();
        this.quantity = quantity;
        this.itemSize = itemSize;
        this.subtotal = menuItem.getItemPrice() * quantity;
        this.menuItemId = menuItem.getItemId();
    }
}
