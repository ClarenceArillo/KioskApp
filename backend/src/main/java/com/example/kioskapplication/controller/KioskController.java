package com.example.kioskapplication.controller;

import com.example.kioskapplication.model.MenuItem;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class KioskController {

    @GetMapping("/Menu")
    public String getMenuItemCategory(String categoryName) {
        return null;
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
