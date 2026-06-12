package com.dearbook.backend.controller;

import com.dearbook.backend.dto.AdminOrderResponse;
import com.dearbook.backend.security.JwtProvider;
import com.dearbook.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final OrderService orderService;
    private final JwtProvider jwtProvider;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:Mh123#@!}")
    private String adminPassword;

    public AdminController(OrderService orderService, JwtProvider jwtProvider) {
        this.orderService = orderService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (adminUsername.equals(username) && adminPassword.equals(password)) {
            String token = jwtProvider.generateToken("admin");
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", adminUsername
            ));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Tên đăng nhập hoặc mật khẩu quản trị viên không chính xác"));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        var pageResult = orderService.getAllOrdersForAdmin(page, size);
        return ResponseEntity.ok(Map.of(
            "orders", pageResult.getContent(),
            "page", pageResult.getNumber(),
            "size", pageResult.getSize(),
            "totalElements", pageResult.getTotalElements(),
            "totalPages", pageResult.getTotalPages()
        ));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<AdminOrderResponse> getOrderDetails(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(orderService.getOrderDetails(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable UUID id,
            @RequestBody Map<String, String> statusBody) {
        String status = statusBody.get("status");
        if (status == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "status is required"));
        }
        try {
            return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            // Distinguish "not found" from validation errors
            if (message != null && message.contains("Order not found")) {
                return ResponseEntity.status(404).body(Map.of("message", message));
            }
            return ResponseEntity.badRequest().body(Map.of("message", message));
        }
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable UUID id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
        } catch (IllegalArgumentException e) {
            String message = e.getMessage();
            if (message != null && message.contains("Order not found")) {
                return ResponseEntity.status(404).body(Map.of("message", message));
            }
            return ResponseEntity.badRequest().body(Map.of("message", message));
        }
    }
}
