package com.example.kioskapplication.KIOSKSCREEN.model;

import com.example.kioskapplication.KIOSKSCREEN.model.OrderType;
import com.example.kioskapplication.KIOSKSCREEN.model.ReceiptItemDTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.List;

public record ReceiptDTO (
        int orderId,
        OrderType orderType,
        LocalDateTime dateTime,
        double totalPrice,
        @JsonProperty("receiptItems")
        List<ReceiptItemDTO> items,
        String companyName,
        String companyAddress,
        String companyPhone,
        String companyEmail,
        String companyLogoUrl
) {
    public ReceiptDTO {
        companyName = "AYA";
        companyAddress = "Makati Avenue, Poblacion, Makati City";
        companyPhone = " (+63) 927-531-4820";
        companyEmail = "ayasahapagmkt@gmail.com";
        companyLogoUrl = "/images/Logo.png";
    }
}
