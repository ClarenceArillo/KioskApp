package com.example.kioskapplication.KITCHENSCREEN.controller;

import com.example.kioskapplication.KIOSKSCREEN.model.CustomerOrder;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import com.example.kioskapplication.KIOSKSCREEN.repository.CustomerOrdersRepository;
import com.example.kioskapplication.KITCHENSCREEN.service.KitchenService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/kitchen")
@CrossOrigin(origins = "*")
public class KitchenController {

    private final List<SseEmitter> emitters = new ArrayList<>();
    private final CustomerOrdersRepository customerOrdersRepository;
    private final KitchenService kitchenService;

    public KitchenController(CustomerOrdersRepository customerOrdersRepository, KitchenService kitchenService) {
        this.customerOrdersRepository = customerOrdersRepository;
        this.kitchenService = kitchenService;
    }

    @GetMapping("/to-prepare")
    public List<Integer> getPendingOrders() {
        return kitchenService.getOrderByStatus(OrderStatus.PENDING)
                .stream()
                .map(CustomerOrder::getOrderId)
                .toList();
    }

    @GetMapping("/done")
    public List<Integer> getDoneOrders() {
        return kitchenService.getOrderByStatus(OrderStatus.DONE)
                .stream()
                .map(CustomerOrder::getOrderId)
                .toList();
    }

    @PutMapping("/to-prepare/{orderId}/start")
    public CustomerOrder startOrder(@PathVariable Integer orderId) {
        return kitchenService.updateOrderStatus(orderId, OrderStatus.PREPARING);
    }

    @PutMapping("/to-prepare/{orderId}/ready")
    public CustomerOrder readyOrder(@PathVariable Integer orderId) {
        return kitchenService.updateOrderStatus(orderId, OrderStatus.NOW_SERVING);
    }

    @PutMapping("/to-prepare/{orderId}/done")
    public CustomerOrder doneOrder(@PathVariable Integer orderId) {
        return kitchenService.updateOrderStatus(orderId, OrderStatus.DONE);
    }

    @GetMapping("done/{orderId}/view")
    public List<CustomerOrder> getDoneOrderById() {
        return kitchenService.getOrderByStatus(OrderStatus.DONE);
    }



}
