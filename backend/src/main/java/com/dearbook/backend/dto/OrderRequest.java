package com.dearbook.backend.dto;

public record OrderRequest(
    String userBookId,
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
    String paymentMethod,
    Object designPages,
    String pdfFileName,
    String pdfFileData
) {}