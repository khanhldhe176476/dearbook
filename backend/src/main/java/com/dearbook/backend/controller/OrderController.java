package com.dearbook.backend.controller;

import com.dearbook.backend.dto.OrderRequest;
import com.dearbook.backend.dto.OrderResponse;
import com.dearbook.backend.service.OrderService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,
            @RequestBody OrderRequest req) {
        return ResponseEntity.ok(orderService.placeOrder(userId, req));
    }

    @GetMapping("/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @RequestHeader(value = "X-User-Id", required = false) UUID userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(orderService.getMyOrders(userId));
    }

    @PostMapping("/{id}/pdf")
    public ResponseEntity<String> uploadPdf(
            @PathVariable UUID id,
 long1
            @RequestHeader(value = "X-User-Id", required = false) UUID userId,

            @RequestHeader("X-User-Id") UUID userId,
 main
            @RequestParam("file") MultipartFile file) {
        orderService.savePdfFile(id, file);
        return ResponseEntity.ok("PDF uploaded successfully");
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

