package com.example.kioskapplication.service;

import com.example.kioskapplication.model.MenuItem;
import com.example.kioskapplication.model.MenuItemCategory;
import com.example.kioskapplication.model.OrderType;
import com.example.kioskapplication.repository.MenuItemRepository;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.ArrayList;
import java.util.List;


@Service
public class KioskScreenService implements KioskService{

    //Before Order Screen Functionalities.
    @Getter
    private boolean orderStarted = false;
    private OrderType orderType = null;

    private final MenuItemRepository menuItemRepository;
    public KioskScreenService(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    private final List<MenuItem> cartItems = new ArrayList<>();

    @Override
    public void startOrder() {
        this.orderStarted = true;
        this.orderType = null;
    }

    @Override
    public void setOrderType(OrderType orderType) {
        if(isOrderStarted()) {
            this.orderType = orderType;
        }else {
            // Handle the case where the order has not started yet
            throw new IllegalStateException("Order has not started yet. Please start an order first.");
        }
    }

    @Override
    public OrderType getOrderType() {
        return orderType;
    }

    //Screen Statics
    @Override
    public List<MenuItemCategory> getMenuItemCategories() {
        if(!isOrderStarted()){
            throw new IllegalStateException("Please start an order to view the menu.");
        }
        if(orderType == null){
            throw new IllegalStateException("Please select an order type to view the menu.");
        }
        return List.of(MenuItemCategory.values());
    }


    @Override
    public List <MenuItem> getAllMenuItemsPerCategory(MenuItemCategory category) {
        if(!isOrderStarted() || orderType == null){
            throw new IllegalStateException("Please start an order to view the menu.");
        }
        return menuItemRepository.findByItemCategorySelected(category);
    }

    //Kiosk Functionalities.
    @Override
    public List<MenuItem> addMenuItemtoCart(MenuItem menuItem) {
        cartItems.add(menuItem);
        return cartItems;
    }

    @Override
    public boolean removeMenuItemFromCart(Long id) {
        return cartItems.removeIf(item -> item.getItemId()==(id));
    }

    @Override
    public String updateMenuItemInCart(Long id, char size, int quantity) {
        for (MenuItem item : cartItems) {
            if (item.getItemId() == id) {
                item.setItemSize(size);
                item.setItemQuantity(quantity);
                ;
            }
        }
        return "Item updated successfully (Size: " + size + ", Quantity: " + quantity + ")";
    }

    @Override
    public List<MenuItem> viewCart() {
        return cartItems;
    }

    @Override
    public String checkout() {
        return null;
    }

    @Override
    public String cancelOrder() {
        return null;
    }



}
