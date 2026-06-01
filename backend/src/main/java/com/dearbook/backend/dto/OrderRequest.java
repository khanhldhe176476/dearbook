package com.dearbook.backend.dto;
import java.util.List;
import java.util.UUID;
public record OrderRequest(UUID userBookId, String recipientName, String phone, String address, String city, String paymentMethod, List<String> selectedPageIds) {}
