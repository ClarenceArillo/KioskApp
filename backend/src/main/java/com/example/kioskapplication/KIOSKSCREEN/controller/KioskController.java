package com.example.kioskapplication.KIOSKSCREEN.controller;

import com.example.kioskapplication.KIOSKSCREEN.model.*;
import com.example.kioskapplication.KIOSKSCREEN.repository.MenuItemRepository;
import com.example.kioskapplication.KIOSKSCREEN.service.KioskScreenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/order")
public class KioskController {

    @Autowired
    private KioskScreenService kioskScreenService;
    private MenuItemRepository menuItemRepository;

    @PostMapping("/start")
    public String startOrder() {
        kioskScreenService.startOrder();
        return "Order started";
    }

    @PostMapping("/type")
    public String selectOrderType(@RequestParam OrderType orderType) {
        if (orderType != null) {
            kioskScreenService.setOrderType(orderType);
        }
        return "Order type set to " + orderType + ", you can now view categories";
    }

    @GetMapping("/categories")
    public List<MenuItemCategory> getMenuItemCategories() {
        return kioskScreenService.getMenuItemCategories();
    }

    @GetMapping("/{category}/menu")
    public ResponseEntity<?> getMenuItemPerCategory(
            @PathVariable MenuItemCategory category,
            @RequestParam(defaultValue = "default") String sortOrder
    ) {
        try {
            List<MenuItem> items = kioskScreenService.getAllMenuItemsPerCategory(category, sortOrder);
            return ResponseEntity.ok(items);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Server error: " + ex.getMessage());
        }
    }

    @PostMapping("/{category}/{itemId}/add")
    public ResponseEntity<List<MenuItem>> addMenuItemToCart(
            @PathVariable MenuItemCategory category,
            @PathVariable Integer itemId,
            @RequestBody(required = false) AddToCartRequest body) {

        // default if body null
        int quantity = 1;
        char size = 'M';
        if (body != null) {
            quantity = (body.getItemQuantity() != null) ? body.getItemQuantity() : 1;
            String s = body.getItemSize();
            if (s != null && s.length() > 0) size = s.charAt(0);
        }

        // delegate to service with quantity & size
        List<MenuItem> updatedCart = kioskScreenService.addMenuItemToCartByCategoryAndId(category, itemId, quantity, size);
        return ResponseEntity.ok(updatedCart);
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
    public ResponseEntity<String> cancelOrder() {
        kioskScreenService.cancelOrder(OrderStatus.CANCELLED);
        return ResponseEntity.ok("✅ Order cancelled successfully. Cart cleared and state reset.");
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

    @GetMapping("/receipt/{orderId}")
    public ResponseEntity<?> getReceipt(@PathVariable Integer orderId) {
        try {
            ReceiptDTO receipt = kioskScreenService.receiptPrintout(orderId);
            // do NOT clear state until after frontend receives it - do that asynchronously if needed
            return ResponseEntity.ok(receipt);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (NoSuchElementException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Server error: " + e.getMessage()));
        }
    }










}
