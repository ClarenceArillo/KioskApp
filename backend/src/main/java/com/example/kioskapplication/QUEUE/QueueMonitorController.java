package com.example.kioskapplication.QUEUE;

import com.example.kioskapplication.KIOSKSCREEN.model.CustomerOrder;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import com.example.kioskapplication.KIOSKSCREEN.repository.CustomerOrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/queue")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4000", "http://localhost:5000"})
public class QueueMonitorController {

    private final CustomerOrdersRepository customerOrdersRepository;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @Autowired
    public QueueMonitorController(CustomerOrdersRepository customerOrdersRepository) {
        this.customerOrdersRepository = customerOrdersRepository;
    }

    // Add this to your QueueMonitorController
    @GetMapping("/test")
    public Map<String, Object> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Queue endpoint is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("status", "success");

        // Test data
        response.put("testPreparingOrders", List.of(
                Map.of("number", 10001, "orderId", 10001, "status", "PREPARING"),
                Map.of("number", 10002, "orderId", 10002, "status", "PREPARING")
        ));
        response.put("testServingOrders", List.of(
                Map.of("number", 10003, "orderId", 10003, "status", "NOW_SERVING")
        ));

        return response;
    }

    // MAIN ENDPOINT for QueueScreen - returns exactly what frontend expects
    // MAIN ENDPOINT for QueueScreen - returns exactly what frontend expects
    @GetMapping("/display")
    public Map<String, Object> getQueueDisplay() {
        List<CustomerOrder> preparingOrders = getPreparingOrders();
        List<CustomerOrder> servingOrders = getReadyOrders(); // NOW_SERVING orders

        // ✅ ADD DEBUG LOGGING
        System.out.println("📊 Queue Display Request:");
        System.out.println("   Preparing Orders: " + preparingOrders.size() + " orders");
        preparingOrders.forEach(order ->
                System.out.println("     - Order " + order.getOrderId() + " (" + order.getOrderStatus() + ")")
        );
        System.out.println("   Serving Orders: " + servingOrders.size() + " orders");
        servingOrders.forEach(order ->
                System.out.println("     - Order " + order.getOrderId() + " (" + order.getOrderStatus() + ")")
        );

        Map<String, Object> response = new HashMap<>();

        // Transform to frontend format - EXACTLY what QueueScreen expects
        response.put("preparingOrders", preparingOrders.stream()
                .map(order -> {
                    Map<String, Object> orderMap = new HashMap<>();
                    orderMap.put("number", order.getOrderId());
                    orderMap.put("orderId", order.getOrderId());
                    orderMap.put("status", order.getOrderStatus());
                    orderMap.put("orderType", order.getOrderType());
                    orderMap.put("orderDateTime", order.getOrderDateTime());
                    return orderMap;
                })
                .collect(Collectors.toList()));

        response.put("servingOrders", servingOrders.stream()
                .map(order -> {
                    Map<String, Object> orderMap = new HashMap<>();
                    orderMap.put("number", order.getOrderId());
                    orderMap.put("orderId", order.getOrderId());
                    orderMap.put("status", order.getOrderStatus());
                    orderMap.put("orderType", order.getOrderType());
                    orderMap.put("orderDateTime", order.getOrderDateTime());
                    return orderMap;
                })
                .collect(Collectors.toList()));

        response.put("totalPreparing", preparingOrders.size());
        response.put("totalServing", servingOrders.size());
        response.put("lastUpdated", java.time.LocalDateTime.now().toString());
        response.put("success", true);

        return response;
    }

    // Get orders currently being prepared (PREPARING status)
    public List<CustomerOrder> getPreparingOrders() {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PREPARING)
                .sorted((o1, o2) -> o1.getOrderId().compareTo(o2.getOrderId()))
                .collect(Collectors.toList());
    }

    // Get orders ready for serving (NOW_SERVING status)
    // In your QueueMonitorController - FIX THE getReadyOrders METHOD
    // Get orders ready for serving (NOW_SERVING status ONLY - exclude DONE)
    public List<CustomerOrder> getReadyOrders() {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.NOW_SERVING) // ✅ REMOVED DONE from here
                .sorted((o1, o2) -> o1.getOrderId().compareTo(o2.getOrderId()))
                .collect(Collectors.toList());
    }

    // Get orders waiting to be prepared (PENDING status)
    @GetMapping("/waiting")
    public List<CustomerOrder> getWaitingOrders() {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PENDING)
                .sorted((o1, o2) -> o1.getOrderId().compareTo(o2.getOrderId()))
                .collect(Collectors.toList());
    }

    // Get all active orders
    @GetMapping("/active")
    public List<CustomerOrder> getActiveOrders() {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PENDING ||
                        order.getOrderStatus() == OrderStatus.PREPARING ||
                        order.getOrderStatus() == OrderStatus.NOW_SERVING)
                .sorted((o1, o2) -> o1.getOrderId().compareTo(o2.getOrderId()))
                .collect(Collectors.toList());
    }

    // SSE endpoint for real-time updates
    @GetMapping("/stream")
    public SseEmitter streamQueueUpdates() {
        SseEmitter emitter = new SseEmitter(3600000L); // 1 hour timeout
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));

        // Send initial data
        try {
            Map<String, Object> initialData = getQueueDisplay();
            emitter.send(SseEmitter.event()
                    .name("queue-update")
                    .data(initialData));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }

    // Method to notify all clients of queue changes - call this from KitchenService
    public void notifyQueueChange() {
        Map<String, Object> displayData = getQueueDisplay();

        List<SseEmitter> deadEmitters = new java.util.ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("queue-update")
                        .data(displayData));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);
    }

    // Get next order number in queue
    @GetMapping("/next")
    public Map<String, Object> getNextOrderNumber() {
        List<CustomerOrder> pendingOrders = getWaitingOrders();
        Map<String, Object> response = new HashMap<>();
        response.put("nextOrder", !pendingOrders.isEmpty() ? pendingOrders.get(0).getOrderId() : null);
        response.put("totalWaiting", pendingOrders.size());
        return response;
    }

    // Get order status by order ID
    @GetMapping("/status/{orderId}")
    public Map<String, Object> getOrderStatus(@PathVariable Integer orderId) {
        CustomerOrder order = customerOrdersRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", orderId);
        response.put("status", order.getOrderStatus().toString());
        response.put("orderType", order.getOrderType());
        response.put("queuePosition", getQueuePosition(orderId));

        return response;
    }

    // Get queue position for an order
    private Integer getQueuePosition(Integer orderId) {
        List<CustomerOrder> activeOrders = getActiveOrders();
        for (int i = 0; i < activeOrders.size(); i++) {
            if (activeOrders.get(i).getOrderId().equals(orderId)) {
                return i + 1;
            }
        }
        return null;
    }

    // Health check endpoint
    @GetMapping("/health")
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        response.put("totalOrders", customerOrdersRepository.count());

        List<CustomerOrder> preparing = getPreparingOrders();
        List<CustomerOrder> serving = getReadyOrders();
        List<CustomerOrder> waiting = getWaitingOrders();

        response.put("preparingCount", preparing.size());
        response.put("servingCount", serving.size());
        response.put("waitingCount", waiting.size());

        return response;
    }
}