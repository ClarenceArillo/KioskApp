package com.example.kioskapplication.KITCHENSCREEN.service;

import com.example.kioskapplication.KIOSKSCREEN.model.CustomerOrder;
import com.example.kioskapplication.KIOSKSCREEN.model.OrderStatus;
import com.example.kioskapplication.KIOSKSCREEN.repository.CustomerOrdersRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class KitchenService {

    private final CustomerOrdersRepository customerOrdersRepository;
    private final List<SseEmitter> emitters = new ArrayList<>();

    KitchenService(CustomerOrdersRepository customerOrdersRepository) {
        this.customerOrdersRepository = customerOrdersRepository;
    }

    public List <CustomerOrder> getOrderByStatus (OrderStatus orderStatus) {
        return customerOrdersRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == orderStatus)
                .sorted(Comparator.comparing(CustomerOrder::getOrderId))
                .toList();
    }

    public CustomerOrder updateOrderStatus (Integer orderId, OrderStatus newStatus){
        CustomerOrder customerOrder = customerOrdersRepository.findById(orderId)
                .orElseThrow(() -> new NoSuchElementException("Customer Order Not Found"));

        switch(newStatus){
            case PREPARING -> {
                if (customerOrder.getOrderStatus() != OrderStatus.PENDING)
                    throw new IllegalArgumentException("Only PENDING orders can be started");
            }
            case NOW_SERVING -> {
                if (customerOrder.getOrderStatus() != OrderStatus.PREPARING)
                    throw new IllegalArgumentException("Only PREPARING orders can be served");
            }
            case DONE -> {
                if (customerOrder.getOrderStatus() != OrderStatus.NOW_SERVING)
                    throw new IllegalArgumentException("Only NOW_SERVING orders can be marked as DONE");
            }
        }

        customerOrder.setOrderStatus(newStatus);
        return customerOrdersRepository.save(customerOrder);

    }

    public SseEmitter streamOrders() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);
        emitters.add(emitter);

        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        return emitter;
    }

    public void notifyKitchen(CustomerOrder newOrder) {
        List <SseEmitter> deadEmitters = new ArrayList<>();
        for (SseEmitter emitter : emitters) {
            try{
                emitter.send(SseEmitter.event()
                        .name("new-order")
                        .data(newOrder));
            }catch (Exception e){
                deadEmitters.add(emitter);
            }
        }
        emitters.removeAll(deadEmitters);
    }

}
