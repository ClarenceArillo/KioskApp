package com.example.kioskapplication.QUEUE;

import com.example.kioskapplication.KIOSKSCREEN.model.CustomerOrder;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import com.example.kioskapplication.KIOSKSCREEN.repository.CustomerOrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/queue")
@CrossOrigin(origins = "*")
public class QueueMonitorController {

    private final CustomerOrdersRepository customerOrdersRepository;
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    @Autowired
    public QueueMonitorController(CustomerOrdersRepository customerOrdersRepository) {
        this.customerOrdersRepository = customerOrdersRepository;
    }

    // Get all active orders (FIFO - by order ID)
    // Get all active orders (FIFO - by order ID)
    @GetMapping("/active")
    public List<CustomerOrder> getActiveOrders() {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PENDING ||
                        order.getOrderStatus() == OrderStatus.PREPARING ||
                        order.getOrderStatus() == OrderStatus.NOW_SERVING)
                .sorted((o1, o2) -> o1.getOrderId().compareTo(o2.getOrderId()))
                .toList();
    }

    // Get orders waiting to be prepared (FIFO)
    @GetMapping("/waiting")
    public List<CustomerOrder> getWaitingOrders() {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PENDING)
                .sorted((o1, o2) -> o1.getOrderId().compareTo(o2.getOrderId()))
                .toList();
    }

    // Get orders currently being prepared
    @GetMapping("/preparing")
    public List<CustomerOrder> getPreparingOrders() {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PREPARING)
                .sorted((o1, o2) -> o1.getOrderId().compareTo(o2.getOrderId()))
                .toList();
    }

    // Get orders ready for serving
    @GetMapping("/ready")
    public List<CustomerOrder> getReadyOrders() {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.NOW_SERVING)
                .sorted((o1, o2) -> o1.getOrderId().compareTo(o2.getOrderId()))
                .toList();
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
            emitter.send(SseEmitter.event()
                    .name("queue-update")
                    .data(getQueueDisplayData()));
        } catch (IOException e) {
            emitter.completeWithError(e);
        }

        return emitter;
    }

    // Method to notify all clients of queue changes
    public void notifyQueueChange() {
        QueueDisplayData displayData = getQueueDisplayData();

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
    public Integer getNextOrderNumber() {
        List<CustomerOrder> pendingOrders = getWaitingOrders();
        return !pendingOrders.isEmpty() ? pendingOrders.get(0).getOrderId() : null;
    }

    // Get current display data for queue monitor screen
    @GetMapping("/display")
    public QueueDisplayData getQueueDisplayData() {
        List<CustomerOrder> waiting = getWaitingOrders();
        List<CustomerOrder> preparing = getPreparingOrders();
        List<CustomerOrder> ready = getReadyOrders();

        return new QueueDisplayData(
                !ready.isEmpty() ? ready.get(0).getOrderId() : null,
                !preparing.isEmpty() ? preparing.get(0).getOrderId() : null,
                waiting.stream().map(CustomerOrder::getOrderId).toList(),
                waiting.size() + preparing.size() + ready.size()
        );
    }

    // Get order status by order ID
    @GetMapping("/status/{orderId}")
    public String getOrderStatus(@PathVariable Integer orderId) {
        CustomerOrder order = customerOrdersRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));
        return order.getOrderStatus().toString();
    }

    // DTO for queue display
    public static class QueueDisplayData {
        private Integer nowServing;
        private Integer nextUp;
        private List<Integer> waitingOrders;
        private Integer totalActiveOrders;

        public QueueDisplayData(Integer nowServing, Integer nextUp, List<Integer> waitingOrders, Integer totalActiveOrders) {
            this.nowServing = nowServing;
            this.nextUp = nextUp;
            this.waitingOrders = waitingOrders;
            this.totalActiveOrders = totalActiveOrders;
        }

        // Getters and setters
        public Integer getNowServing() { return nowServing; }
        public void setNowServing(Integer nowServing) { this.nowServing = nowServing; }

        public Integer getNextUp() { return nextUp; }
        public void setNextUp(Integer nextUp) { this.nextUp = nextUp; }

        public List<Integer> getWaitingOrders() { return waitingOrders; }
        public void setWaitingOrders(List<Integer> waitingOrders) { this.waitingOrders = waitingOrders; }

        public Integer getTotalActiveOrders() { return totalActiveOrders; }
        public void setTotalActiveOrders(Integer totalActiveOrders) { this.totalActiveOrders = totalActiveOrders; }
    }
}