package com.example.kioskapplication.KIOSKSCREEN.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ReceiptOrderedItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ReceiptOrderedItemsId;

    private String itemName;
    private double itemPrice;
    private int quantity;
    private char itemSize; // S, M, L
    private double subtotal;
}
