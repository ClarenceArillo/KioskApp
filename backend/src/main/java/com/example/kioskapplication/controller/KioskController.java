package com.example.kioskapplication.controller;

import com.example.kioskapplication.model.*;
import com.example.kioskapplication.repository.MenuItemRepository;
import com.example.kioskapplication.service.KioskScreenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/{category}/{itemId}/add")
    public List<MenuItem> addMenuItem(@PathVariable MenuItemCategory category,@PathVariable Long itemId,  @RequestBody MenuItem menuItem) {
        return kioskScreenService.addMenuItemtoCart(menuItem);
    }

    @PutMapping("/cart/view/update")
    public String updateMenuItem(@RequestParam Long id, @RequestParam char size, @RequestParam int quantity) {
        String update =  kioskScreenService.updateMenuItemInCart(id, size, quantity);
        return update + "Item updated in cart";
    }

    @DeleteMapping("/cart/view/remove")
    public String removeMenuItem(@RequestBody MenuItem menuItem) {
        boolean removed = kioskScreenService.removeMenuItemFromCart(menuItem.getItemId());
        return removed ? "Item removed from cart" : "Item not found in cart";
    }

    @GetMapping("/cart/view")
    public List<MenuItem> viewCart() {
        return kioskScreenService.viewCart();
    }

    @PostMapping("/cart/view/checkout")
    public String checkout() {
        kioskScreenService.checkout();
        return  "Order checked out successfully";
    }

    @PostMapping("/cart/view/cancel")
    public String cancelOrder() {
        kioskScreenService.cancelOrder(OrderStatus.CANCELLED);
        return "Order cancelled";
    }

    @PostMapping("/cart/view/pay")
    public ResponseEntity<?> payOrder() {
        try {
            Integer orderId = kioskScreenService.payOrder();
            return ResponseEntity.ok("Order paid successfully! Your order ID: " + orderId);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/receipt/{orderId}" )
    public ResponseEntity<?> getReceipt(@PathVariable Integer orderId) {
        try{
            ReceiptDTO receipt = kioskScreenService.receiptPrintout(orderId);
            kioskScreenService.completeOrder();
            return ResponseEntity.ok(receipt);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }





}
