package com.dearbook.backend.dto;
import java.util.UUID;
public record TemplatePageResponse(UUID id, Integer pageNumber, String layoutType, String defaultContent) {}
