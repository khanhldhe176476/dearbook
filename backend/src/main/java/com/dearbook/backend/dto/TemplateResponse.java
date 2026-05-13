package com.dearbook.backend.dto;
import java.math.BigDecimal;
import java.util.UUID;
public record TemplateResponse(UUID id, String name, String description, String coverImageUrl, BigDecimal price) {}
