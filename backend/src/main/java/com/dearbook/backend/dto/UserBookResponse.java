package com.dearbook.backend.dto;
import java.util.UUID;
import java.time.OffsetDateTime;
public record UserBookResponse(UUID id, String title, String status, OffsetDateTime updatedAt) {}
