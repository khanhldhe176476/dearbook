package com.dearbook.backend.controller;

import com.dearbook.backend.dto.OrderRequest;
import com.dearbook.backend.dto.OrderResponse;
import com.dearbook.backend.security.UserPrincipal;
import com.dearbook.backend.service.CouponService;
import com.dearbook.backend.service.OrderService;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    private final CouponService couponService;

    public OrderController(OrderService orderService, CouponService couponService) {
        this.orderService = orderService;
        this.couponService = couponService;
    }

    /**
     * Extract userId from the authenticated JWT principal.
     * The SecurityConfig requires authentication on /api/orders/**,
     * so Authentication will always be present here.
     */
    private UUID getUserIdFromAuth(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            return null;
        }
        return principal.getId();
    }

    @PostMapping("/validate-coupon")
    public ResponseEntity<?> validateCoupon(@RequestBody Map<String, Object> payload) {
        String code = (String) payload.get("code");
        Object totalObj = payload.get("orderTotal");
        BigDecimal orderTotal;
        try {
            orderTotal = new BigDecimal(String.valueOf(totalObj));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("valid", false, "message", "orderTotal không hợp lệ"));
        }
        Map<String, Object> result = couponService.validate(code, orderTotal);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> placeOrder(
            Authentication authentication,
            @RequestBody OrderRequest req) {
        try {
            UUID userId = getUserIdFromAuth(authentication);
            return ResponseEntity.ok(orderService.placeOrder(userId, req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        UUID userId = getUserIdFromAuth(authentication);
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.getMyOrders(userId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable UUID id,
            Authentication authentication) {
        try {
            UUID userId = getUserIdFromAuth(authentication);
            return ResponseEntity.ok(orderService.cancelMyOrder(userId, id));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            HttpStatus status = message != null && message.contains("not found")
                    ? HttpStatus.NOT_FOUND
                    : HttpStatus.BAD_REQUEST;
            return ResponseEntity.status(status).body(Map.of("message", message));
        }
    }

    @PostMapping("/{id}/pdf")
    public ResponseEntity<String> uploadPdf(
            @PathVariable UUID id,
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        orderService.savePdfFile(id, file);
        return ResponseEntity.ok("PDF uploaded successfully");
    }

    @PostMapping("/upload-pdf")
    public ResponseEntity<Map<String, String>> uploadPdfTemp(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {
        String relativePath = orderService.savePdfFileTemp(file);
        return ResponseEntity.ok(Map.of("filePath", relativePath, "fileName", file.getOriginalFilename()));
    }

    @PostMapping("/upload-pdf-chunk")
    public ResponseEntity<?> uploadPdfChunk(
            Authentication authentication,
            @RequestParam("uploadId") String uploadId,
            @RequestParam("chunkIndex") int chunkIndex,
            @RequestParam("totalChunks") int totalChunks,
            @RequestParam("file") MultipartFile file) {
        try {
            orderService.savePdfChunk(uploadId, chunkIndex, file);
            return ResponseEntity.ok(Map.of("status", "chunk_uploaded", "chunkIndex", chunkIndex));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Failed to upload chunk: " + e.getMessage()));
        }
    }

    @PostMapping("/merge-pdf-chunks")
    public ResponseEntity<?> mergePdfChunks(
            Authentication authentication,
            @RequestBody Map<String, String> payload) {
        try {
            String uploadId = payload.get("uploadId");
            String fileName = payload.get("fileName");
            if (uploadId == null || fileName == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Missing uploadId or fileName"));
            }
            String relativePath = orderService.mergePdfChunks(uploadId, fileName);
            return ResponseEntity.ok(Map.of("filePath", relativePath, "fileName", fileName));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Failed to merge chunks: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/pdf/download")
    public ResponseEntity<?> downloadPdf(@PathVariable UUID id) {
        try {
            Resource resource = orderService.loadPdfFileAsResource(id);
            String filename = orderService.getPdfFileName(id);
            if (filename == null || filename.isBlank()) {
                filename = "design.pdf";
            }

            ContentDisposition contentDisposition = ContentDisposition.attachment()
                    .filename(filename, java.nio.charset.StandardCharsets.UTF_8)
                    .build();

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition.toString())
                    .body(resource);
        } catch (Exception e) {
            log.warn("PDF download failed for order {}: {}", id, e.getMessage());
            return ResponseEntity.status(404).body(Map.of(
                    "message", "PDF file not found on server",
                    "orderId", id.toString()
            ));
        }
    }
}

