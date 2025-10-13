package com.example.kioskapplication.KIOSKSCREEN.model;

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
        companyName = "AYA";
        companyAddress = "Makati Avenue, Poblacion, Makati City";
        companyPhone = " (+63) 927-531-4820";
        companyEmail = "ayamnl@gmail.com";
        companyLogoUrl = "/images/Logo.png";
    }
}
