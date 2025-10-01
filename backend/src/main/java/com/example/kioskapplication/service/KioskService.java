package com.example.kioskapplication.service;

import com.example.kioskapplication.model.MenuItem;
import com.example.kioskapplication.model.MenuItemCategory;
import com.example.kioskapplication.model.OrderType;
import java.util.List;

public interface KioskService {

    //before order
    public void startOrder();
    public void setOrderType(OrderType orderType);
    public OrderType getOrderType();

    //screen statics
    public List <MenuItemCategory> getMenuItemCategories();
    public List<MenuItem> getAllMenuItemsPerCategory(MenuItemCategory category);

    //order screen functionalities
    public String addMenuItemtoCart(Long id, char size, int quantity);
    public String removeMenuItemFromCart(Long id, char size);
    public String updateMenuItemInCart(Long id, char size, int quantity);
    public String viewCart();
    public String checkout();
    public String cancelOrder();





}
