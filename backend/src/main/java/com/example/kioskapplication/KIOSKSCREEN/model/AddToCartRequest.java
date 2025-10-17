package com.example.kioskapplication.KIOSKSCREEN.model;

public class AddToCartRequest {
    private Integer itemQuantity = 1;
    private String itemSize = "M";

    // default constructor
    public AddToCartRequest() {}

    // getters/setters
    public Integer getItemQuantity() {
        return itemQuantity;
    }

    public void setItemQuantity(Integer itemQuantity) {
        if (itemQuantity != null && itemQuantity > 0) this.itemQuantity = itemQuantity;
    }

    public String getItemSize() {
        return itemSize;
    }

    public void setItemSize(String itemSize) {
        if (itemSize != null) this.itemSize = itemSize;
    }
}