package com.example.kioskapplication.KIOSKSCREEN.repository;

import com.example.kioskapplication.KIOSKSCREEN.model.CustomerOrder;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerOrdersRepository extends JpaRepository<CustomerOrder, Integer> {
    Optional<CustomerOrder> findByOrderId(Integer orderId);

    // Optional: Add this for getting the latest order
    Optional<CustomerOrder> findTopByOrderByOrderIdDesc();

    // Find orders by status in FIFO order (by orderId)
    List<CustomerOrder> findByOrderStatusOrderByOrderIdAsc(OrderStatus orderStatus);

    // Find orders by multiple statuses in FIFO order
    List<CustomerOrder> findByOrderStatusInOrderByOrderIdAsc(List<OrderStatus> orderStatuses);

    // Find pending orders with orderId less than given ID (for wait time calculation)
    List<CustomerOrder> findByOrderStatusAndOrderIdLessThanOrderByOrderIdAsc(OrderStatus orderStatus, Integer orderId);
}