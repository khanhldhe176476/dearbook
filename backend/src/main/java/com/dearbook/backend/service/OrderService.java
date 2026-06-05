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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepo;
    private final OrderShippingRepository shippingRepo;
    private final UserBookRepository bookRepo;
    private final PaymentRepository paymentRepo;
    private final ProfileRepository profileRepo;
    private final UserBookPageRepository userBookPageRepo;
    private final PricingService pricingService;
    private final ObjectMapper objectMapper;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

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
        shipping.setDistrict(req.district());
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

        String previousStatus = order.getStatus();
        order.setStatus(status);

        // Atomic update: all payments for this order in a single query
        if ("COMPLETED".equals(status)) {
            int updated = paymentRepo.updateStatusByOrderId(id, "COMPLETED");
            log.info("Order {}: status changed from {} → {} | {} payment(s) updated to COMPLETED",
                    id, previousStatus, status, updated);
        } else if ("CANCELLED".equals(status)) {
            int updated = paymentRepo.updateStatusByOrderId(id, "FAILED");
            log.info("Order {}: status changed from {} → {} | {} payment(s) updated to FAILED",
                    id, previousStatus, status, updated);
        } else {
            log.info("Order {}: status changed from {} → {}", id, previousStatus, status);
        }

        return mapToAdminOrderResponse(orderRepo.save(order));
    }

    private AdminOrderResponse mapToAdminOrderResponse(Order o) {
        var shipping = shippingRepo.findByOrderId(o.getId()).orElse(null);
        var book = o.getUserBook();
        var payments = paymentRepo.findByOrderId(o.getId());
        String paymentMethod = (payments != null && !payments.isEmpty()) ? payments.get(0).getPaymentMethod() : null;

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
                shipping != null ? shipping.getDistrict() : "",
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
                o.getPdfFileData() != null && !o.getPdfFileData().isBlank() ? "/api/orders/" + o.getId() + "/pdf/download" : null,
                o.getTotalAmount(),
                paymentMethod,
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

    @Transactional
    public void savePdfFile(UUID orderId, MultipartFile file) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        try {
            Path uploadPath = Paths.get(uploadDir, "pdf");
            Files.createDirectories(uploadPath);

            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String savedFileName = orderId.toString() + "_" + System.currentTimeMillis() + fileExtension;
            Path filePath = uploadPath.resolve(savedFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            order.setPdfFileName(originalFilename);
            // Store relative path for portability (uploadDir/pdf/filename)
            order.setPdfFileData(Paths.get("pdf", savedFileName).toString());
            orderRepo.save(order);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store PDF file", e);
        }
    }

    public Resource loadPdfFileAsResource(UUID orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        String filePathString = order.getPdfFileData();
        if (filePathString == null || filePathString.isBlank()) {
            throw new IllegalArgumentException("No PDF file uploaded for this order");
        }

        try {
            // Resolve relative path against configured upload directory
            Path filePath = Paths.get(uploadDir).resolve(filePathString).normalize();
            // Security: ensure resolved path is still under uploadDir
            if (!filePath.toAbsolutePath().startsWith(Paths.get(uploadDir).toAbsolutePath())) {
                throw new IllegalArgumentException("Invalid file path (path traversal)");
            }
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new IllegalArgumentException("File not found or not readable");
            }
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid file path", e);
        }
    }

    public String getPdfFileName(UUID orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return order.getPdfFileName();
    }
}