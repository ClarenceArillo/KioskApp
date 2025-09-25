package com.example.kioskapplication.model;

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
    private int itemId;
    private String itemName;
    private double itemPrice;
    private String itemDescription;
    private String itemCategory;
    private String itemImageUrl;
    private boolean isAvailable;
    private char itemSize; // S, M, L

    @Enumerated(EnumType.STRING)
    private MenuItemCategory itemCategorySelected; // BURGER_SANDWICHES, CHICKEN_PLATTERS, DRINKS, DESSERTS, SIDES_FRIES, VALUE_MEALS_COMBOS

}
