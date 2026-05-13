package com.dearbook.backend.dto;
import java.util.UUID;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
public record OrderResponse(UUID id, BigDecimal totalAmount, String status, OffsetDateTime createdAt) {}
