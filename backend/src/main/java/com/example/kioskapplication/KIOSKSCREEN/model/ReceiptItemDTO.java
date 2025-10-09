package com.example.kioskapplication.KIOSKSCREEN.model;

public record ReceiptItemDTO(
        String itemName,
        double itemPrice,
        int quantity,
        char itemSize,
        double subtotal
) {}
