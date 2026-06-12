package com.dearbook.backend.controller;

import com.dearbook.backend.dto.OrderRequest;
import com.dearbook.backend.dto.OrderResponse;
import com.dearbook.backend.security.UserPrincipal;
import com.dearbook.backend.service.OrderService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
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

    @GetMapping("/{id}/pdf/download")
    public ResponseEntity<Resource> downloadPdf(@PathVariable UUID id) {
        try {
            Resource resource = orderService.loadPdfFileAsResource(id);
            String filename = orderService.getPdfFileName(id);
            if (filename == null || filename.isBlank()) {
                filename = "design.pdf";
            }

            String encodedFilename = java.net.URLEncoder.encode(filename, java.nio.charset.StandardCharsets.UTF_8.toString())
                    .replaceAll("\\+", "%20");

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"; filename*=UTF-8''" + encodedFilename)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

