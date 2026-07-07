package com.dearbook.backend.dto;

public record UserBookSnapshotRequest(
    String clientBookId,
    String templateId,
    String title,
    String status,
    String bookData
) {}
