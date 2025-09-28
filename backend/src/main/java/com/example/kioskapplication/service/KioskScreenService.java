package com.example.kioskapplication.service;

import com.example.kioskapplication.model.MenuItem;
import com.example.kioskapplication.model.MenuItemCategory;
import com.example.kioskapplication.model.OrderType;
import lombok.Getter;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class KioskScreenService implements KioskService{

    //Before Order Screen Functionalities.
    @Getter
    private boolean orderStarted = false;
    private OrderType orderType = null;

    @Override
    public void startOrder(OrderType orderType) {
        this.orderStarted = true;
        this.orderType = orderType;
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
    public List<MenuItem> setMenuItemValue() {
        return null;
    }

    @Override
    public List <MenuItem> getAllMenuItemsPerCategory() {
        return null;
    }

    public List <MenuItem> addMenuItem (MenuItem menuItem) {
        return null;
    }

    //Kiosk Functionalities.
    @Override
    public String addMenuItemtoCart(Long id, char size, int quantity) {
        return null;
    }

    @Override
    public String removeMenuItemFromCart(Long id, char size) {
        return null;
    }

    @Override
    public String updateMenuItemInCart(Long id, char size, int quantity) {
        return null;
    }

    @Override
    public String viewCart() {
        return null;
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
