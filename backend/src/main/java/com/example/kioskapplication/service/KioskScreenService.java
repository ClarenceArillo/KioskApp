package com.example.kioskapplication.service;

import com.example.kioskapplication.model.MenuItem;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KioskScreenService implements KioskService{

    //Screen Statics
    @Override
    public String getMenuItemCategory(String categoryName) {
        return null;
    }

    @Override
    public List <MenuItem> getAllMenuItems() {
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
