package com.example.kioskapplication.KIOSKSCREEN.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long itemId;
    private String itemName;

    @Enumerated(EnumType.STRING)
    private MenuItemCategory itemCategorySelected; //  WHATs_NEW, FAMILY_MEAL, ALMUSAL, RICE_MEAL, MERYENDA, PANGHIMAGAS

    private int itemQuantity = 1; // default quantity is 1
    private double itemPrice;
    private String itemDescription;
    private String itemImageUrl;
    private char itemSize; // S, M, L

}
