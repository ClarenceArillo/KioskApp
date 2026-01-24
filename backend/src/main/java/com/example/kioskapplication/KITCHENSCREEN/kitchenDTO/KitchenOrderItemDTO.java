package com.example.kioskapplication.KITCHENSCREEN.kitchenDTO;

public class KitchenOrderItemDTO {
    private String itemName;
    private double itemPrice;
    private int quantity;
    private char itemSize;
    private double subtotal;

    // Constructors
    public KitchenOrderItemDTO() {}

    public KitchenOrderItemDTO(String itemName, double itemPrice, int quantity, char itemSize, double subtotal) {
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.quantity = quantity;
        this.itemSize = itemSize;
        this.subtotal = subtotal;
    }

    // Getters and Setters
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public double getItemPrice() { return itemPrice; }
    public void setItemPrice(double itemPrice) { this.itemPrice = itemPrice; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public char getItemSize() { return itemSize; }
    public void setItemSize(char itemSize) { this.itemSize = itemSize; }

    public double getSubtotal() { return subtotal; }
    public void setSubtotal(double subtotal) { this.subtotal = subtotal; }
}
