package com.example.kioskapplication.service;

import com.example.kioskapplication.model.MenuItem;

import java.util.List;

public interface KioskService {

    public String getMenuItemCategory(String categoryName);
    public List<MenuItem> getAllMenuItems();

    public String addMenuItemtoCart(Long id, char size, int quantity);
    public String removeMenuItemFromCart(Long id, char size);
    public String updateMenuItemInCart(Long id, char size, int quantity);
    public String viewCart();
    public String checkout();
    public String cancelOrder();





}
