package com.dearbook.backend.service;

import com.dearbook.backend.dto.OrderRequest;
import com.dearbook.backend.dto.OrderResponse;
import com.dearbook.backend.dto.AdminOrderResponse;
import com.dearbook.backend.entity.Order;
import com.dearbook.backend.entity.OrderShipping;
import com.dearbook.backend.entity.Payment;
import com.dearbook.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    private final OrderRepository orderRepo;
    private final OrderShippingRepository shippingRepo;
    private final UserBookRepository bookRepo;
    private final PaymentRepository paymentRepo;
    private final ProfileRepository profileRepo;
    private final UserBookPageRepository userBookPageRepo;

    public OrderService(OrderRepository orderRepo, OrderShippingRepository shippingRepo, 
                        UserBookRepository bookRepo, PaymentRepository paymentRepo, 
                        ProfileRepository profileRepo, UserBookPageRepository userBookPageRepo) {
        this.orderRepo = orderRepo;
        this.shippingRepo = shippingRepo;
        this.bookRepo = bookRepo;
        this.paymentRepo = paymentRepo;
        this.profileRepo = profileRepo;
        this.userBookPageRepo = userBookPageRepo;
    }

    @Transactional
    public OrderResponse placeOrder(UUID userId, OrderRequest req) {
        var user = profileRepo.findById(userId).orElseThrow();
        var book = bookRepo.findById(req.userBookId()).orElseThrow();
        
        // Calculate amount (using template price * quantity)
        var quantity = req.quantity() != null ? req.quantity() : 1;
        var basePrice = book.getTemplate().getPrice() != null ? book.getTemplate().getPrice() : BigDecimal.valueOf(150000);
        var totalAmount = basePrice.multiply(BigDecimal.valueOf(quantity));

        Order order = new Order();
        order.setUser(user);
        order.setUserBook(book);
        order.setCustomerName(req.customerName() != null ? req.customerName() : req.recipientName());
        order.setEmail(req.email() != null ? req.email() : user.getEmail());
        order.setQuantity(quantity);
        order.setNote(req.note());
        order.setCollectionName(req.collectionName() != null ? req.collectionName() : book.getTemplate().getName());
        order.setProductType(req.productType() != null ? req.productType() : "hardcover");
        order.setProductSize(req.productSize() != null ? req.productSize() : "20x20");
        order.setCustomPages(req.customPages());
        order.setTotalAmount(totalAmount);
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
        payment.setAmount(totalAmount);
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

    // Admin dashboard service methods
    public List<AdminOrderResponse> getAllOrdersForAdmin() {
        return orderRepo.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::mapToAdminOrderResponse)
                .toList();
    }

    public AdminOrderResponse getOrderDetails(UUID id) {
        Order order = orderRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return mapToAdminOrderResponse(order);
    }

    @Transactional
    public AdminOrderResponse updateOrderStatus(UUID id, String status) {
        Order order = orderRepo.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setStatus(status);
        
        // Also update payment status if completed/cancelled
        List<Payment> payments = paymentRepo.findByOrderId(id);
        if (payments != null) {
            for (Payment payment : payments) {
                if ("COMPLETED".equals(status)) {
                    payment.setStatus("COMPLETED");
                } else if ("CANCELLED".equals(status)) {
                    payment.setStatus("FAILED");
                }
                paymentRepo.save(payment);
            }
        }
        
        return mapToAdminOrderResponse(orderRepo.save(order));
    }

    private AdminOrderResponse mapToAdminOrderResponse(Order o) {
        var shipping = shippingRepo.findByOrderId(o.getId()).orElse(null);
        var book = o.getUserBook();
        
        List<AdminOrderResponse.PageData> pages = List.of();
        if (book != null) {
            pages = userBookPageRepo.findByUserBookIdOrderByPageNumberAsc(book.getId())
                    .stream()
                    .map(p -> new AdminOrderResponse.PageData(p.getId(), p.getPageNumber(), parseJsonSafely(p.getUserContent())))
                    .toList();
        }

        return new AdminOrderResponse(
            o.getId(),
            o.getCustomerName() != null ? o.getCustomerName() : (shipping != null ? shipping.getRecipientName() : ""),
            shipping != null ? shipping.getPhone() : "",
            o.getEmail() != null ? o.getEmail() : (o.getUser() != null ? o.getUser().getEmail() : ""),
            shipping != null ? shipping.getAddress() : "",
            shipping != null ? shipping.getCity() : "",
            o.getCollectionName() != null ? o.getCollectionName() : (book != null && book.getTemplate() != null ? book.getTemplate().getName() : ""),
            o.getProductType() != null ? o.getProductType() : "hardcover",
            o.getProductSize() != null ? o.getProductSize() : "20x20",
            o.getCustomPages() != null ? o.getCustomPages() : pages.size(),
            o.getQuantity() != null ? o.getQuantity() : 1,
            o.getNote(),
            book != null ? book.getId() : null,
            book != null ? book.getTitle() : "",
            pages,
            o.getTotalAmount(),
            o.getStatus(),
            o.getCreatedAt(),
            o.getUpdatedAt()
        );
    }

    private Object parseJsonSafely(String json) {
        if (json == null) return null;
        try {
            return new com.fasterxml.jackson.databind.ObjectMapper().readValue(json, Object.class);
        } catch (Exception e) {
            return json;
        }
    }
}
