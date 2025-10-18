\package com.example.kioskapplication.QUEUE;

import com.example.kioskapplication.KIOSKSCREEN.model.CustomerOrder;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import com.example.kioskapplication.KIOSKSCREEN.repository.CustomerOrdersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QueueMonitorService {

    private final CustomerOrdersRepository customerOrdersRepository;

    @Autowired
    public QueueMonitorService(CustomerOrdersRepository customerOrdersRepository) {
        this.customerOrdersRepository = customerOrdersRepository;
    }

    // Get all active orders (PENDING, PREPARING, NOW_SERVING) in FIFO order (by orderId or orderDateTime)
    public List<CustomerOrder> getActiveOrders() {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.PENDING ||
                        order.getOrderStatus() == OrderStatus.PREPARING ||
                        order.getOrderStatus() == OrderStatus.NOW_SERVING)
                .sorted((o1, o2) -> o1.getOrderId().compareTo(o2.getOrderId())) // FIFO by orderId (which is generated in sequence)
                .collect(Collectors.toList());
    }

    // Get current order being served (the first order in the active list that is NOW_SERVING, or if none, then the first that is PREPARING, etc.)
    public CustomerOrder getCurrentServingOrder() {
        List<CustomerOrder> activeOrders = getActiveOrders();
        // Priority: NOW_SERVING -> PREPARING -> PENDING
        for (CustomerOrder order : activeOrders) {
            if (order.getOrderStatus() == OrderStatus.NOW_SERVING) {
                return order;
            }
        }
        for (CustomerOrder order : activeOrders) {
            if (order.getOrderStatus() == OrderStatus.PREPARING) {
                return order;
            }
        }
        return activeOrders.isEmpty() ? null : activeOrders.get(0);
    }

    // Get the next order to be served (the first order that is not yet being served)
    public CustomerOrder getNextOrder() {
        List<CustomerOrder> activeOrders = getActiveOrders();
        if (activeOrders.size() > 1) {
            // The second order in the list (if any) is the next one
            return activeOrders.get(1);
        }
        return null;
    }

    // Get the position of an order in the queue by orderId
    public Integer getQueuePosition(Integer orderId) {
        List<CustomerOrder> activeOrders = getActiveOrders();
        for (int i = 0; i < activeOrders.size(); i++) {
            if (activeOrders.get(i).getOrderId().equals(orderId)) {
                return i + 1; // 1-based position
            }
        }
        return null;
    }
}