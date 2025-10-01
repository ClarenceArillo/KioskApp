package com.example.kioskapplication.controller;

import com.example.kioskapplication.model.MenuItem;
import com.example.kioskapplication.model.MenuItemCategory;
import com.example.kioskapplication.model.OrderType;
import com.example.kioskapplication.repository.MenuItemRepository;
import com.example.kioskapplication.service.KioskScreenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
public class KioskController {

    @Autowired
    private KioskScreenService kioskScreenService;

    @PostMapping("/start")
    public String startOrder() {
        kioskScreenService.startOrder();
        return "Order started";
    }

    @PostMapping("/type")
    public String selectOrderType(@RequestParam OrderType orderType) {
        kioskScreenService.setOrderType(orderType);
        return "Order type set to " + orderType + ", you can now view categories";
    }

    @GetMapping("/categories")
    public List<MenuItemCategory> getMenuItemCategories() {
        return kioskScreenService.getMenuItemCategories();
    }

    @GetMapping("/menu")
    public List<MenuItem> getMenuItemPerCategory(@RequestParam MenuItemCategory category) {
        return kioskScreenService.getAllMenuItemsPerCategory(category);
    }


    @PostMapping("/Menu/{MenuItemCategory}")
    public List<MenuItem> addMenuItem(MenuItem menuItem) {
        return null;
    }

    @GetMapping("/Menu/{MenuItemCategory}")
    public List<MenuItem> getMenuItemPerCategory() {
        return null;
    }


}
