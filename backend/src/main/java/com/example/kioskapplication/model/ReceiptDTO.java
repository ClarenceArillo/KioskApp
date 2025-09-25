package com.example.kioskapplication.model;

import java.time.LocalDateTime;
import java.util.List;

public record ReceiptDTO (
    int orderId,
    OrderType orderType,
    LocalDateTime dateTime,
    double totalPrice,
    List<ReceiptItemDTO> items,
    String companyName,
    String companyAddress,
    String companyPhone,
    String companyEmail,
    String companyLogoUrl,
    String cashierName
)
{}
