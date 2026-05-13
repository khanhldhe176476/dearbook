package com.dearbook.backend.service;

import com.dearbook.backend.dto.OrderRequest;
import com.dearbook.backend.dto.OrderResponse;
import com.dearbook.backend.entity.Order;
import com.dearbook.backend.entity.OrderShipping;
import com.dearbook.backend.entity.Payment;
import com.dearbook.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    private final OrderRepository orderRepo;
    private final OrderShippingRepository shippingRepo;
    private final UserBookRepository bookRepo;
    private final PaymentRepository paymentRepo;
    private final ProfileRepository profileRepo;

    public OrderService(OrderRepository orderRepo, OrderShippingRepository shippingRepo, 
                        UserBookRepository bookRepo, PaymentRepository paymentRepo, 
                        ProfileRepository profileRepo) {
        this.orderRepo = orderRepo;
        this.shippingRepo = shippingRepo;
        this.bookRepo = bookRepo;
        this.paymentRepo = paymentRepo;
        this.profileRepo = profileRepo;
    }

    @Transactional
    public OrderResponse placeOrder(UUID userId, OrderRequest req) {
        var user = profileRepo.findById(userId).orElseThrow();
        var book = bookRepo.findById(req.userBookId()).orElseThrow();
        
        // Calculate amount (using template price)
        var amount = book.getTemplate().getPrice();

        Order order = new Order();
        order.setUser(user);
        order.setUserBook(book);
        order.setTotalAmount(amount);
        order.setStatus("PENDING");
        var savedOrder = orderRepo.save(order);

        // Save shipping info
        OrderShipping shipping = new OrderShipping();
        shipping.setOrder(savedOrder);
        shipping.setRecipientName(req.recipientName());
        shipping.setPhone(req.phone());
        shipping.setAddress(req.address());
        shipping.setCity(req.city());
        shippingRepo.save(shipping);

        // Initialize payment entry
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(amount);
        payment.setPaymentMethod(req.paymentMethod());
        payment.setStatus("PENDING");
        paymentRepo.save(payment);

        return new OrderResponse(savedOrder.getId(), savedOrder.getTotalAmount(), savedOrder.getStatus(), savedOrder.getCreatedAt());
    }

    public List<OrderResponse> getMyOrders(UUID userId) {
        return orderRepo.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(o -> new OrderResponse(o.getId(), o.getTotalAmount(), o.getStatus(), o.getCreatedAt()))
                .toList();
    }
}
