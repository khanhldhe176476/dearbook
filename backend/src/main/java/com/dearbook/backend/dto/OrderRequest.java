package com.dearbook.backend.dto;
import java.util.UUID;

public record OrderRequest(
    UUID userBookId,
    String customerName,
    String recipientName,
    String phone,
    String email,
    String address,
    String city,
    Integer quantity,
    String note,
    String collectionName,
    String productType,
    String productSize,
    Integer customPages,
    String paymentMethod
) {}
