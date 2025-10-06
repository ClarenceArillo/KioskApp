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
    String companyLogoUrl

)
{
    public ReceiptDTO{
        companyName = "Kiosk Restaurant";
        companyAddress = "123 Food Street, City, State 12345";
        companyPhone = "(555) 123-4567";
        companyEmail = "info@kioskrestaurant.com";
        companyLogoUrl = "/images/logo.png";
    }
}
