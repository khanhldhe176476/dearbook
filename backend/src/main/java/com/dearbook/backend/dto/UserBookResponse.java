package com.dearbook.backend.dto;
import java.util.UUID;
import java.time.OffsetDateTime;
public record UserBookResponse(
    UUID id,
    String clientBookId,
    String templateId,
    String title,
    String status,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt,
    String bookData
) {}
