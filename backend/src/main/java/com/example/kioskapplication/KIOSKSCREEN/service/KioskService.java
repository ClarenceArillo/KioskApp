package com.example.kioskapplication.KIOSKSCREEN.service;

import com.example.kioskapplication.KIOSKSCREEN.model.MenuItem;
import com.example.kioskapplication.KIOSKSCREEN.model.MenuItemCategory;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderType;
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
    public List<MenuItem> addMenuItemtoCart(MenuItem menuItem);
    public boolean removeMenuItemFromCart(Long id);
    public String updateMenuItemInCart(Long id, char size, int quantity);
    public List<MenuItem> viewCart();
    public void checkout();
    public void cancelOrder(OrderStatus orderStatus);
    Integer payOrder();





}
