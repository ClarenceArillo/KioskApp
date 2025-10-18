package com.example.kioskapplication.KITCHENSCREEN.controller;

import com.example.kioskapplication.KIOSKSCREEN.model.CustomerOrder;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import com.example.kioskapplication.KIOSKSCREEN.repository.CustomerOrdersRepository;

import com.example.kioskapplication.KITCHENSCREEN.kitchenDTO.KitchenOrderDTO;
import com.example.kioskapplication.KITCHENSCREEN.kitchenDTO.KitchenOrderItemDTO;
import com.example.kioskapplication.KITCHENSCREEN.service.KitchenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/kitchen")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000"})
public class KitchenController {

    private final CustomerOrdersRepository customerOrdersRepository;
    private final KitchenService kitchenService;

    public KitchenController(CustomerOrdersRepository customerOrdersRepository, KitchenService kitchenService) {
        this.customerOrdersRepository = customerOrdersRepository;
        this.kitchenService = kitchenService;
    }

    // GET order by ID - SIMPLE VERSION
    @GetMapping("/to-prepare/{orderId}")
    public ResponseEntity<CustomerOrder> getOrderById(@PathVariable Integer orderId) {
        try {
            CustomerOrder order = customerOrdersRepository.findById(orderId)
                    .orElseThrow(() -> new NoSuchElementException("Order not found with ID: " + orderId));
            return ResponseEntity.ok(order);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // GET pending/preparing/serving orders
    @GetMapping("/to-prepare")
    public List<Integer> getPendingOrders() {
        return kitchenService.getOrderByStatus(OrderStatus.PENDING)
                .stream()
                .map(CustomerOrder::getOrderId)
                .toList();
    }

    // GET done orders
    @GetMapping("/done")
    public List<Integer> getDoneOrders() {
        return kitchenService.getOrderByStatus(OrderStatus.DONE)
                .stream()
                .map(CustomerOrder::getOrderId)
                .toList();
    }

    // GET done order details
    @GetMapping("/done/{orderId}/view")
    public ResponseEntity<CustomerOrder> getDoneOrderById(@PathVariable Integer orderId) {
        try {
            CustomerOrder order = customerOrdersRepository.findById(orderId)
                    .orElseThrow(() -> new NoSuchElementException("Done order not found with ID: " + orderId));

            if (order.getOrderStatus() != OrderStatus.DONE) {
                return ResponseEntity.badRequest().build();
            }

            return ResponseEntity.ok(order);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
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

    // SSE for real-time updates
    @GetMapping("/stream")
    public SseEmitter streamOrders() {
        return kitchenService.streamOrders();
    }
}