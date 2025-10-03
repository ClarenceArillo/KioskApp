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

    @GetMapping("/{category}/menu")
    public List<MenuItem> getMenuItemPerCategory(@PathVariable MenuItemCategory category) {
        return kioskScreenService.getAllMenuItemsPerCategory(category);
    }

    @PostMapping("/cart/add")
    public List<MenuItem> addMenuItem(@RequestBody MenuItem menuItem) {
        return kioskScreenService.addMenuItemtoCart(menuItem);
    }

    @PutMapping("/cart/update")
    public String updateMenuItem(@RequestParam Long id, @RequestParam char size, @RequestParam int quantity) {
        String update =  kioskScreenService.updateMenuItemInCart(id, size, quantity);
        return update + "Item updated in cart";
    }

    @DeleteMapping("/cart/remove")
    public String removeMenuItem(@RequestBody MenuItem menuItem) {
        boolean removed = kioskScreenService.removeMenuItemFromCart(menuItem.getItemId());
        return removed ? "Item removed from cart" : "Item not found in cart";
    }

    @GetMapping("/cart/view")
    public List<MenuItem> viewCart() {
        return kioskScreenService.viewCart();
    }
}
