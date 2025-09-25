package com.example.kioskapplication.model;

public record ReceiptItemDTO(
        String itemName,
        double itemPrice,
        int quantity,
        char itemSize,
        double subtotal
) {}
