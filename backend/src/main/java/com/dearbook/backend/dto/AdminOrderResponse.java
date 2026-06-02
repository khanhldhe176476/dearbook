package com.dearbook.backend.dto;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record AdminOrderResponse(
    UUID id,
    // Customer info
    String customerName,
    String phone,
    String email,
    String address,
    String city,
    // Photobook info
    String collectionName,
    String productType,
    String productSize,
    Integer customPages,
    Integer quantity,
    String note,
    // Book/design data
    UUID bookId,
    String bookTitle,
    Object pages,
    // Order state
    BigDecimal totalAmount,
    String status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public record PageData(UUID id, int pageNumber, Object userContent) {}
}
