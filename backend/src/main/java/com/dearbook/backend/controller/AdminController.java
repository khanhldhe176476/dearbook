package com.dearbook.backend.controller;

import com.dearbook.backend.dto.AdminOrderResponse;
import com.dearbook.backend.security.JwtProvider;
import com.dearbook.backend.service.OrderService;
import com.dearbook.backend.service.PageViewService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final OrderService orderService;
    private final JwtProvider jwtProvider;
    private final PageViewService pageViewService;

    @Value("${app.admin.username:admin}")
    private String adminUsername;

    @Value("${app.admin.password:Mh123#@!}")
    private String adminPassword;

    public AdminController(OrderService orderService, JwtProvider jwtProvider, PageViewService pageViewService) {
        this.orderService = orderService;
        this.jwtProvider = jwtProvider;
        this.pageViewService = pageViewService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        if (username != null) {
            username = username.trim();
        }

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

    @DeleteMapping("/orders/bulk")
    public ResponseEntity<?> deleteOrdersBulk(@RequestBody Map<String, List<UUID>> body) {
        List<UUID> ids = body.get("ids");
        if (ids == null || ids.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "No ids provided"));
        }
        try {
            orderService.deleteOrdersBulk(ids);
            return ResponseEntity.ok(Map.of("message", "Orders deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/orders/pdf/migrate-to-supabase")
    public ResponseEntity<?> migrateOrderPdfsToSupabase(
            @RequestParam(defaultValue = "false") boolean apply) {
        try {
            return ResponseEntity.ok(orderService.migrateExistingLocalOrderPdfsToSupabase(apply));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // -------------------------------------------------------------------------
    // Visitor / Page-view tracking
    // -------------------------------------------------------------------------

    /**
     * Public endpoint — frontend gọi để ghi nhận mỗi lượt truy cập.
     * Không yêu cầu xác thực (được khai báo permitAll trong SecurityConfig).
     */
    @PostMapping("/pageview/record")
    public ResponseEntity<?> recordPageView(
            @RequestBody(required = false) Map<String, String> body,
            HttpServletRequest request) {
        String page = body != null ? body.getOrDefault("page", "/") : "/";
        String userAgent = request.getHeader("User-Agent");

        // Lấy IP thật khi đứng sau reverse proxy
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank()) {
            ip = request.getRemoteAddr();
        } else {
            ip = ip.split(",")[0].trim();
        }

        pageViewService.recordView(page, ip, userAgent);
        return ResponseEntity.ok(Map.of("recorded", true));
    }

    /**
     * Admin-only endpoint — trả về thống kê lượt truy cập.
     */
    @GetMapping("/stats/visits")
    public ResponseEntity<?> getVisitStats() {
        return ResponseEntity.ok(Map.of(
                "total",    pageViewService.getTotalCount(),
                "today",    pageViewService.getTodayCount(),
                "last7Days", pageViewService.getLast7Days()
        ));
    }
}
