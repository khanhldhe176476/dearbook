package com.dearbook.backend.dto;
import java.util.UUID;
public record UserBookRequest(UUID templateId, String title) {}
