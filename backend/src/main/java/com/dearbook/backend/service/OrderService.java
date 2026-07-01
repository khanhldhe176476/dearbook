package com.dearbook.backend.service;

import com.dearbook.backend.dto.AdminOrderResponse;
import com.dearbook.backend.dto.OrderRequest;
import com.dearbook.backend.dto.OrderResponse;
import com.dearbook.backend.entity.Order;
import com.dearbook.backend.entity.OrderShipping;
import com.dearbook.backend.entity.Payment;
import com.dearbook.backend.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Base64;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Service
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    /**
     * Order status state machine — defines which transitions are allowed.
     * PENDING → CONFIRMED | CANCELLED
     * CONFIRMED → PRINTING | CANCELLED
     * PRINTING → COMPLETED | CANCELLED
     * COMPLETED → (terminal)
     * CANCELLED → (terminal)
     */
    private static final Map<String, Set<String>> ALLOWED_TRANSITIONS = Map.of(
        "PENDING",   Set.of("CONFIRMED", "CANCELLED"),
        "CONFIRMED", Set.of("PRINTING", "CANCELLED"),
        "PRINTING",  Set.of("COMPLETED", "CANCELLED"),
        "COMPLETED", Set.of(),
        "CANCELLED", Set.of()
    );

    private static final Set<String> VALID_STATUSES = Set.of(
        "PENDING", "CONFIRMED", "PRINTING", "COMPLETED", "CANCELLED"
    );

    private static final Set<String> VALID_PRODUCT_TYPES = Set.of(
        "softcover", "hardcover", "layflat", "spiral"
    );

    private static final Set<String> VALID_PAYMENT_METHODS = Set.of(
        "FULL"
    );

    /** Vietnamese phone number: starts with 0, exactly 10 digits */
    private static final java.util.regex.Pattern VN_PHONE_PATTERN =
        java.util.regex.Pattern.compile("^0\\d{9}$");

    private final OrderRepository orderRepo;
    private final OrderShippingRepository shippingRepo;
    private final UserBookRepository bookRepo;
    private final PaymentRepository paymentRepo;
    private final ProfileRepository profileRepo;
    private final UserBookPageRepository userBookPageRepo;
    private final PricingService pricingService;
    private final CouponService couponService;
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
            CouponService couponService,
            ObjectMapper objectMapper
    ) {
        this.orderRepo = orderRepo;
        this.shippingRepo = shippingRepo;
        this.bookRepo = bookRepo;
        this.paymentRepo = paymentRepo;
        this.profileRepo = profileRepo;
        this.userBookPageRepo = userBookPageRepo;
        this.pricingService = pricingService;
        this.couponService = couponService;
        this.objectMapper = objectMapper;
    }

    /**
     * Validate order request fields that the frontend normally enforces,
     * but could be bypassed by direct API calls.
     */
    private void validateOrderRequest(OrderRequest req) {
        if (req.recipientName() == null || req.recipientName().isBlank()) {
            throw new IllegalArgumentException("recipientName is required");
        }
        if (req.phone() == null || !VN_PHONE_PATTERN.matcher(req.phone()).matches()) {
            throw new IllegalArgumentException("phone must be a valid Vietnamese phone number (10 digits, starting with 0)");
        }
        if (req.address() == null || req.address().isBlank()) {
            throw new IllegalArgumentException("address is required");
        }
        if (req.city() == null || req.city().isBlank()) {
            throw new IllegalArgumentException("city is required");
        }
        if (req.paymentMethod() == null || !VALID_PAYMENT_METHODS.contains(req.paymentMethod().toUpperCase())) {
            throw new IllegalArgumentException("paymentMethod must be FULL, got: " + req.paymentMethod());
        }

        String productType = req.productType() != null ? req.productType().toLowerCase() : "hardcover";
        if (!VALID_PRODUCT_TYPES.contains(productType)) {
            throw new IllegalArgumentException("productType must be one of: " + String.join(", ", VALID_PRODUCT_TYPES));
        }

        int customPages = req.customPages() != null ? req.customPages() : 0;
        int pagesLimit = pricingService.getPagesLimit(productType);
        if (customPages < pagesLimit) {
            throw new IllegalArgumentException(
                "customPages (" + customPages + ") is below the minimum of " + pagesLimit + " for product type " + productType);
        }

        if (req.email() != null && !req.email().isBlank() && !req.email().contains("@")) {
            throw new IllegalArgumentException("email is invalid: " + req.email());
        }
    }

    @Transactional
    public OrderResponse placeOrder(UUID userId, OrderRequest req) {
        validateOrderRequest(req);

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
        BigDecimal totalAmount = pricingService.calculateTotal(
                req.productType(),
                req.productSize(),
                customPages,
                req.paymentMethod()
        );
        // Multiply by quantity for multiple copies
        totalAmount = totalAmount.multiply(BigDecimal.valueOf(quantity));

        // ── Áp dụng mã giảm giá (nếu có) ──
        BigDecimal discountAmount = BigDecimal.ZERO;
        String appliedCouponCode = null;

        if (req.couponCode() != null && !req.couponCode().isBlank()) {
            Map<String, Object> couponResult = couponService.validate(
                    req.couponCode().trim().toUpperCase(),
                    totalAmount
            );
            if (Boolean.TRUE.equals(couponResult.get("valid"))) {
                discountAmount = (BigDecimal) couponResult.get("discountAmount");
                appliedCouponCode = (String) couponResult.get("code");
                totalAmount = totalAmount.subtract(discountAmount).max(BigDecimal.ZERO);
                log.info("Coupon {} applied: discount={}, finalTotal={}",
                        appliedCouponCode, discountAmount, totalAmount);
            } else {
                // Mã không hợp lệ — vẫn cho đặt hàng nhưng không áp dụng giảm giá
                log.warn("Coupon {} rejected: {}", req.couponCode(), couponResult.get("message"));
            }
        }

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
        order.setCouponCode(appliedCouponCode);
        order.setDiscountAmount(discountAmount);
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

        // ── Đánh dấu mã giảm giá đã dùng (sau khi order đã lưu thành công) ──
        if (appliedCouponCode != null) {
            boolean incremented = couponService.apply(appliedCouponCode);
            if (incremented) {
                log.info("Coupon {} usage count incremented for order {}", appliedCouponCode, savedOrder.getId());
            } else {
                log.warn("Failed to increment usage count for coupon {} (order {})", appliedCouponCode, savedOrder.getId());
            }
        }

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

    /**
     * Get all orders for admin with pagination.
     * @param page zero-based page index (default 0)
     * @param size page size (default 20, max 100)
     */
    public Page<AdminOrderResponse> getAllOrdersForAdmin(int page, int size) {
        int safePage = Math.max(0, page);
        int safeSize = Math.min(Math.max(1, size), 100); // clamp between 1 and 100
        Pageable pageable = PageRequest.of(safePage, safeSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        return orderRepo.findAll(pageable).map(this::mapToAdminOrderResponse);
    }

    public AdminOrderResponse getOrderDetails(UUID id) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return mapToAdminOrderResponse(order);
    }

    @Transactional
    public AdminOrderResponse updateOrderStatus(UUID id, String newStatus) {
        if (newStatus == null || !VALID_STATUSES.contains(newStatus)) {
            throw new IllegalArgumentException(
                "Invalid status: " + newStatus + ". Must be one of: " + String.join(", ", VALID_STATUSES));
        }

        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        String previousStatus = order.getStatus();
        Set<String> allowedNext = ALLOWED_TRANSITIONS.getOrDefault(previousStatus, Set.of());

        if (!allowedNext.contains(newStatus)) {
            throw new IllegalArgumentException(
                "Cannot transition order " + id + " from " + previousStatus + " to " + newStatus
                + ". Allowed transitions: " + String.join(", ", allowedNext));
        }

        order.setStatus(newStatus);

        // Atomically update all payments for this order in a single query
        if ("COMPLETED".equals(newStatus)) {
            int updated = paymentRepo.updateStatusByOrderId(id, "COMPLETED");
            log.info("Order {}: status changed from {} → {} | {} payment(s) updated to COMPLETED",
                    id, previousStatus, newStatus, updated);
        } else if ("CANCELLED".equals(newStatus)) {
            int updated = paymentRepo.updateStatusByOrderId(id, "FAILED");
            log.info("Order {}: status changed from {} → {} | {} payment(s) updated to FAILED",
                    id, previousStatus, newStatus, updated);
        } else {
            log.info("Order {}: status changed from {} → {}", id, previousStatus, newStatus);
        }

        return mapToAdminOrderResponse(orderRepo.save(order));
    }

    @Transactional
    public void deleteOrder(UUID id) {
        Order order = orderRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        // Delete associated payment and shipping
        paymentRepo.deleteByOrderId(id);
        shippingRepo.deleteByOrderId(id);

        // Delete the order itself
        orderRepo.delete(order);
        log.info("Order {}: deleted successfully", id);
    }

    @Transactional
    public void deleteOrdersBulk(List<UUID> ids) {
        for (UUID id : ids) {
            try {
                deleteOrder(id);
            } catch (Exception e) {
                log.error("Failed to delete order {}: {}", id, e.getMessage());
            }
        }
        log.info("Bulk deleted {} orders", ids.size());
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
            Path uploadPath = getUploadRoot().resolve("pdf");
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

    public String savePdfFileTemp(MultipartFile file) {
        try {
            Path uploadPath = getUploadRoot().resolve("pdf");
            Files.createDirectories(uploadPath);

            String originalFilename = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String savedFileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + fileExtension;
            Path filePath = uploadPath.resolve(savedFileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return Paths.get("pdf", savedFileName).toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store temporary PDF file", e);
        }
    }

    public void savePdfChunk(String uploadId, int chunkIndex, MultipartFile file) {
        try {
            // Target directory: uploads/pdf/chunks/<uploadId>/
            Path chunkDir = getUploadRoot().resolve("pdf").resolve("chunks").resolve(uploadId);
            Files.createDirectories(chunkDir);

            Path chunkPath = chunkDir.resolve("chunk_" + chunkIndex);
            Files.copy(file.getInputStream(), chunkPath, StandardCopyOption.REPLACE_EXISTING);
            log.info("Saved chunk {} for uploadId {}", chunkIndex, uploadId);
        } catch (IOException e) {
            log.error("Error saving chunk {} for uploadId {}", chunkIndex, uploadId, e);
            throw new RuntimeException("Failed to store chunk " + chunkIndex, e);
        }
    }

    public String mergePdfChunks(String uploadId, String originalFilename) {
        try {
            Path chunkDir = getUploadRoot().resolve("pdf").resolve("chunks").resolve(uploadId);
            if (!Files.exists(chunkDir) || !Files.isDirectory(chunkDir)) {
                throw new IllegalArgumentException("No chunks found for upload ID: " + uploadId);
            }

            // Find all chunk files and sort them numerically by their index suffix
            List<Path> chunkFiles;
            try (java.util.stream.Stream<Path> stream = Files.list(chunkDir)) {
                chunkFiles = stream
                        .filter(path -> path.getFileName().toString().startsWith("chunk_"))
                        .sorted((p1, p2) -> {
                            String name1 = p1.getFileName().toString().substring(6);
                            String name2 = p2.getFileName().toString().substring(6);
                            return Integer.compare(Integer.parseInt(name1), Integer.parseInt(name2));
                        })
                        .toList();
            }

            if (chunkFiles.isEmpty()) {
                throw new IllegalArgumentException("No chunk files found to merge");
            }

            // Create target file name in uploads/pdf
            Path uploadPath = getUploadRoot().resolve("pdf");
            Files.createDirectories(uploadPath);

            String fileExtension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String savedFileName = UUID.randomUUID().toString() + "_" + System.currentTimeMillis() + fileExtension;
            Path mergedFilePath = uploadPath.resolve(savedFileName);

            // Merge chunks using FileChannel
            try (java.nio.channels.FileChannel outChannel = java.nio.channels.FileChannel.open(mergedFilePath,
                    java.nio.file.StandardOpenOption.CREATE,
                    java.nio.file.StandardOpenOption.WRITE)) {
                long position = 0;
                for (Path chunkFile : chunkFiles) {
                    try (java.nio.channels.FileChannel inChannel = java.nio.channels.FileChannel.open(chunkFile, java.nio.file.StandardOpenOption.READ)) {
                        long size = inChannel.size();
                        long transferred = inChannel.transferTo(0, size, outChannel);
                        while (transferred < size) {
                            transferred += inChannel.transferTo(transferred, size - transferred, outChannel);
                        }
                    }
                }
            }

            log.info("Merged {} chunks into file {} for uploadId {}", chunkFiles.size(), mergedFilePath, uploadId);

            // Clean up chunks folder and its contents
            for (Path chunkFile : chunkFiles) {
                Files.deleteIfExists(chunkFile);
            }
            Files.deleteIfExists(chunkDir);

            return Paths.get("pdf", savedFileName).toString();
        } catch (IOException e) {
            log.error("Failed to merge chunks for uploadId {}", uploadId, e);
            throw new RuntimeException("Failed to merge PDF chunks", e);
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
            Resource inlinePdf = tryLoadInlinePdf(filePathString);
            if (inlinePdf != null) {
                return inlinePdf;
            }

            List<Path> candidates = resolvePdfFileCandidates(filePathString);
            for (Path filePath : candidates) {
                Resource resource = new UrlResource(filePath.toUri());
                if (resource.exists() && resource.isReadable()) {
                    return resource;
                }
            }

            log.warn("PDF file missing or unreadable for order {}. storedPath={}, checkedPaths={}",
                    orderId, filePathString, candidates);
            throw new IllegalArgumentException("File not found or not readable");
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid file path", e);
        }
    }

    public String getPdfFileName(UUID orderId) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        return order.getPdfFileName();
    }

    private Path getUploadRoot() {
        return Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    private List<Path> getAllowedUploadRoots() {
        LinkedHashSet<Path> roots = new LinkedHashSet<>();
        Path configuredRoot = getUploadRoot();
        Path workingDir = Paths.get("").toAbsolutePath().normalize();

        roots.add(configuredRoot);
        roots.add(workingDir.resolve("uploads").normalize());
        roots.add(workingDir.resolve("backend").resolve("uploads").normalize());

        Path parent = workingDir.getParent();
        if (parent != null) {
            roots.add(parent.resolve("uploads").normalize());
            roots.add(parent.resolve("backend").resolve("uploads").normalize());
        }

        return new ArrayList<>(roots);
    }

    private List<Path> resolvePdfFileCandidates(String storedPath) {
        String normalizedPath = storedPath.trim().replace('\\', '/');
        while (normalizedPath.startsWith("/")) {
            normalizedPath = normalizedPath.substring(1);
        }

        Path rawPath = Paths.get(normalizedPath);
        List<Path> uploadRoots = getAllowedUploadRoots();
        LinkedHashSet<Path> candidates = new LinkedHashSet<>();

        if (rawPath.isAbsolute()) {
            Path absolutePath = rawPath.toAbsolutePath().normalize();
            if (isInsideAnyUploadRoot(absolutePath, uploadRoots)) {
                candidates.add(absolutePath);
            } else {
                log.warn("Blocked PDF download because absolute path is outside upload roots. requested={}, roots={}",
                        absolutePath, uploadRoots);
            }
            return new ArrayList<>(candidates);
        }

        List<String> relativeVariants = new ArrayList<>();
        relativeVariants.add(normalizedPath);

        if (normalizedPath.startsWith("uploads/")) {
            relativeVariants.add(normalizedPath.substring("uploads/".length()));
        } else {
            relativeVariants.add("uploads/" + normalizedPath);
        }

        if (!normalizedPath.startsWith("pdf/")) {
            relativeVariants.add("pdf/" + Paths.get(normalizedPath).getFileName().toString());
        }

        for (Path root : uploadRoots) {
            for (String variant : relativeVariants) {
                Path candidate = root.resolve(variant).normalize();
                if (candidate.startsWith(root)) {
                    candidates.add(candidate);
                } else {
                    log.warn("Blocked PDF download because path escapes upload root. root={}, requested={}",
                            root, variant);
                }
            }
        }

        return new ArrayList<>(candidates);
    }

    private boolean isInsideAnyUploadRoot(Path path, List<Path> uploadRoots) {
        return uploadRoots.stream().anyMatch(path::startsWith);
    }

    private Resource tryLoadInlinePdf(String pdfFileData) {
        String value = pdfFileData.trim();
        String base64Data = null;

        if (value.startsWith("data:application/pdf;base64,")) {
            base64Data = value.substring("data:application/pdf;base64,".length());
        } else if (value.startsWith("JVBERi0")) {
            base64Data = value;
        }

        if (base64Data == null) {
            return null;
        }

        byte[] bytes = Base64.getDecoder().decode(base64Data.getBytes(StandardCharsets.UTF_8));
        return new ByteArrayResource(bytes);
    }
}
