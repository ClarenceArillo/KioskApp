package com.example.kioskapplication.KITCHENSCREEN.controller;

import com.example.kioskapplication.KIOSKSCREEN.model.CustomerOrder;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import com.example.kioskapplication.KIOSKSCREEN.repository.CustomerOrdersRepository;
import com.example.kioskapplication.KITCHENSCREEN.service.KitchenService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/kitchen")
@CrossOrigin(origins = "*")
public class KitchenController {

    private final CustomerOrdersRepository customerOrdersRepository;
    private final KitchenService kitchenService;

    public KitchenController(CustomerOrdersRepository customerOrdersRepository, KitchenService kitchenService) {
        this.customerOrdersRepository = customerOrdersRepository;
        this.kitchenService = kitchenService;
    }

    @GetMapping("/to-prepare")
    public List<CustomerOrder> getPendingOrders() {
        return kitchenService.getOrderByStatus(OrderStatus.PENDING);
    }

    @GetMapping("/done")
    public List<CustomerOrder> getDoneOrders() {
        return kitchenService.getOrderByStatus(OrderStatus.DONE);
    }

    @PutMapping("/to-prepare/{orderId}/start")
    public CustomerOrder startOrder(@PathVariable Integer orderId) {
        return kitchenService.updateOrderStatus(orderId, OrderStatus.PREPARING);
    }

    @PutMapping("/to-prepare/{orderId}/ready")
    public CustomerOrder readyOrder(@PathVariable Integer orderId) {
        return kitchenService.updateOrderStatus(orderId, OrderStatus.PREPARING);
    }

    @PutMapping("/to-prepare/{orderId}/done")
    public CustomerOrder doneOrder(@PathVariable Integer orderId) {
        return kitchenService.updateOrderStatus(orderId, OrderStatus.PREPARING);
    }

    @GetMapping("done/view")
    public List<CustomerOrder> getAllDoneOrders() {
        return kitchenService.getOrderByStatus(OrderStatus.DONE);
    }






}
