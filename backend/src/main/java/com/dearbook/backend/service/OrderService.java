package com.dearbook.backend.service;

import com.dearbook.backend.dto.AdminOrderResponse;
import com.dearbook.backend.dto.OrderRequest;
import com.dearbook.backend.dto.OrderResponse;
import com.dearbook.backend.entity.Order;
import com.dearbook.backend.entity.OrderShipping;
import com.dearbook.backend.entity.Payment;
import com.dearbook.backend.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Sort;
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
    private final PricingService pricingService;
    private final ObjectMapper objectMapper;

    public OrderService(
            OrderRepository orderRepo,
            OrderShippingRepository shippingRepo,
            UserBookRepository bookRepo,
            PaymentRepository paymentRepo,
            ProfileRepository profileRepo,
            UserBookPageRepository userBookPageRepo,
            PricingService pricingService,
            ObjectMapper objectMapper
    ) {
        this.orderRepo = orderRepo;
        this.shippingRepo = shippingRepo;
        this.bookRepo = bookRepo;
        this.paymentRepo = paymentRepo;
        this.profileRepo = profileRepo;
        this.userBookPageRepo = userBookPageRepo;
        this.pricingService = pricingService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public OrderResponse placeOrder(UUID userId, OrderRequest req) {
        var user = userId != null ? profileRepo.findById(userId).orElse(null) : null;
        UUID parsedBookId = null;
        if (req.userBookId() != null) {
            try {
                parsedBookId = UUID.fromString(req.userBookId());
            } catch (IllegalArgumentException e) {
                // Ignore fake ID
            }
        }
        var book = parsedBookId != null ? bookRepo.findById(parsedBookId).orElse(null) : null;

        int quantity = req.quantity() != null ? req.quantity() : 1;
        int customPages = req.customPages() != null ? req.customPages() : 0;

        // Use PricingService to calculate the total consistently with the frontend
        // Formula: basePrice(productType, size) + extraPages * extraPageCost + shippingFee
        // With 50% discount if payment method is DEPOSIT
        BigDecimal totalAmount = pricingService.calculateTotal(
                req.productType(),
                req.productSize(),
                customPages,
                req.paymentMethod()
        );
        // Multiply by quantity for multiple copies
        totalAmount = totalAmount.multiply(BigDecimal.valueOf(quantity));

        Order order = new Order();
        order.setUser(user);
        order.setUserBook(book);
        order.setCustomerName(req.customerName() != null ? req.customerName() : req.recipientName());
        order.setEmail(req.email() != null ? req.email() : (user != null ? user.getEmail() : ""));
        order.setQuantity(quantity);
        order.setNote(req.note());
        order.setCollectionName(req.collectionName() != null ? req.collectionName() : (book != null && book.getTemplate() != null ? book.getTemplate().getName() : "Photobook"));
        order.setProductType(req.productType() != null ? req.productType() : "hardcover");
        order.setProductSize(req.productSize() != null ? req.productSize() : "20x20");
        order.setCustomPages(req.customPages());
        order.setPdfFileName(req.pdfFileName());
        order.setPdfFileData(req.pdfFileData());
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");

        if (req.designPages() != null) {
            try {
                order.setSelectedPageIds(objectMapper.writeValueAsString(req.designPages()));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        Order savedOrder = orderRepo.save(order);

        OrderShipping shipping = new OrderShipping();
        shipping.setOrder(savedOrder);
        shipping.setRecipientName(req.recipientName());
        shipping.setPhone(req.phone());
        shipping.setAddress(req.address());
        shipping.setCity(req.city());
        shippingRepo.save(shipping);

        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(req.paymentMethod());
        payment.setStatus("PENDING");
        paymentRepo.save(payment);

        return new OrderResponse(
                savedOrder.getId(),
                savedOrder.getTotalAmount(),
                savedOrder.getStatus(),
                savedOrder.getCreatedAt()
        );
    }

    public List<OrderResponse> getMyOrders(UUID userId) {
        return orderRepo.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(o -> new OrderResponse(
                        o.getId(),
                        o.getTotalAmount(),
                        o.getStatus(),
                        o.getCreatedAt()
                ))
                .toList();
    }

    public List<AdminOrderResponse> getAllOrdersForAdmin() {
        return orderRepo.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
                .stream()
                .map(this::mapToAdminOrderResponse)
                .toList();
    }

    public AdminOrderResponse getOrderDetails(UUID id) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return mapToAdminOrderResponse(order);
    }

    @Transactional
    public AdminOrderResponse updateOrderStatus(UUID id, String status) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        order.setStatus(status);

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

        Object pages = null;
        if (o.getSelectedPageIds() != null && !o.getSelectedPageIds().isBlank()) {
            pages = parseJsonSafely(o.getSelectedPageIds());
        } else if (book != null) {
            pages = userBookPageRepo.findByUserBookIdOrderByPageNumberAsc(book.getId())
                    .stream()
                    .map(p -> new AdminOrderResponse.PageData(
                            p.getId(),
                            p.getPageNumber(),
                            parseJsonSafely(p.getUserContent())
                    ))
                    .toList();
        }

        return new AdminOrderResponse(
                o.getId(),
                o.getCustomerName() != null ? o.getCustomerName() : (shipping != null ? shipping.getRecipientName() : ""),
                shipping != null ? shipping.getPhone() : "",
                o.getEmail() != null ? o.getEmail() : (o.getUser() != null ? o.getUser().getEmail() : ""),
                shipping != null ? shipping.getAddress() : "",
                shipping != null ? shipping.getCity() : "",
                o.getCollectionName() != null
                        ? o.getCollectionName()
                        : (book != null && book.getTemplate() != null ? book.getTemplate().getName() : ""),
                o.getProductType() != null ? o.getProductType() : "hardcover",
                o.getProductSize() != null ? o.getProductSize() : "20x20",
                o.getCustomPages() != null ? o.getCustomPages() : (pages instanceof List ? ((List<?>) pages).size() : 0),
                o.getQuantity() != null ? o.getQuantity() : 1,
                o.getNote(),
                book != null ? book.getId() : null,
                book != null ? book.getTitle() : "",
                pages,
                o.getPdfFileName(),
                o.getPdfFileData(),
                o.getTotalAmount(),
                o.getStatus(),
                o.getCreatedAt(),
                o.getUpdatedAt()
        );
    }

    private Object parseJsonSafely(String json) {
        if (json == null || json.isBlank()) {
            return null;
        }

        try {
            return objectMapper.readValue(json, Object.class);
        } catch (Exception e) {
            return json;
        }
    }
}