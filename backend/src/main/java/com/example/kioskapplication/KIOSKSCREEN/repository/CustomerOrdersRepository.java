package com.example.kioskapplication.KIOSKSCREEN.repository;

import com.example.kioskapplication.KIOSKSCREEN.model.CustomerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerOrdersRepository extends JpaRepository <CustomerOrder, Integer> {
    Optional<CustomerOrder> findByOrderId(Integer orderId);

    // Optional: Add this for getting the latest order
    Optional<CustomerOrder> findTopByOrderByOrderIdDesc();
}
