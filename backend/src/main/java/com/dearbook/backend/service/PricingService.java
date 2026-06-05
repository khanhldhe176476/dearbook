package com.dearbook.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Centralized pricing service that matches the frontend pricing logic exactly.
 *
 * This ensures price consistency between what the user sees in OrderFlow
 * and what is stored in the database.
 *
 * Frontend reference: src/components/OrderFlow.tsx (products array & pricing logic)
 */
@Service
public class PricingService {

    // ── Product definitions (must match OrderFlow.tsx exactly) ──

    private static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(30_000);
    private static final BigDecimal DEPOSIT_RATE = BigDecimal.valueOf(0.5);

    /**
     * Calculate the base price for a given product type and size.
     */
    public BigDecimal getBasePrice(String productType, String productSize) {
        return switch (normalizeProductType(productType)) {
            case "softcover" -> BigDecimal.valueOf(245_000);
            case "hardcover" -> BigDecimal.valueOf(375_000);
            case "layflat"   -> BigDecimal.valueOf(399_000);
            default          -> BigDecimal.valueOf(150_000); // fallback for unknown types
        };
    }

    /**
     * Get the number of pages included in the base price for a product type.
     */
    public int getPagesLimit(String productType) {
        return switch (normalizeProductType(productType)) {
            case "softcover", "hardcover" -> 40;
            case "layflat"                -> 14;
            default                       -> 40;
        };
    }

    /**
     * Get the additional cost per page beyond the included limit.
     */
    public BigDecimal getExtraPageCost(String productType) {
        return switch (normalizeProductType(productType)) {
            case "softcover", "hardcover" -> BigDecimal.valueOf(6_000);
            case "layflat"                -> BigDecimal.valueOf(15_000);
            default                       -> BigDecimal.valueOf(6_000);
        };
    }

    /**
     * Get the additional cost per sheet (2 pages) beyond the included limit.
     */
    public BigDecimal getExtraSheetCost(String productType) {
        return switch (normalizeProductType(productType)) {
            case "softcover", "hardcover" -> BigDecimal.valueOf(12_000);
            case "layflat"                -> BigDecimal.valueOf(30_000);
            default                       -> BigDecimal.valueOf(12_000);
        };
    }

    /**
     * Calculate the full order total matching the frontend formula:
     * <pre>
     *   basePrice = productType + size → price
     *   extraPages = max(0, customPages - pagesLimit)
     *   extraPrice = extraPages × extraPageCost
     *   totalOriginal = basePrice + extraPrice + shippingFee
     *   total = paymentMethod == 'deposit' ? totalOriginal × 0.5 : totalOriginal
     * </pre>
     *
     * @param productType   one of: softcover, hardcover, layflat
     * @param productSize   one of: A4, 20x20 (currently only layflat requires 20x20)
     * @param customPages   number of pages the user wants to print
     * @param paymentMethod FULL or DEPOSIT (case-insensitive)
     * @return the calculated total amount
     */
    public BigDecimal calculateTotal(String productType, String productSize, int customPages, String paymentMethod) {
        BigDecimal basePrice = getBasePrice(productType, productSize);
        int pagesLimit = getPagesLimit(productType);
        BigDecimal extraPageCost = getExtraPageCost(productType);

        int additionalPages = Math.max(0, customPages - pagesLimit);
        BigDecimal extraPrice = extraPageCost.multiply(BigDecimal.valueOf(additionalPages));

        BigDecimal totalOriginal = basePrice.add(extraPrice).add(SHIPPING_FEE);

        if (isDeposit(paymentMethod)) {
            return totalOriginal.multiply(DEPOSIT_RATE).setScale(0, RoundingMode.HALF_UP);
        }

        return totalOriginal.setScale(0, RoundingMode.HALF_UP);
    }

    /**
     * Calculate the full (non-deposit) total — used for storing the actual order value
     * even when the user only pays a deposit.
     */
    public BigDecimal calculateFullTotal(String productType, String productSize, int customPages) {
        return calculateTotal(productType, productSize, customPages, "FULL");
    }

    private boolean isDeposit(String paymentMethod) {
        return paymentMethod != null && paymentMethod.trim().equalsIgnoreCase("DEPOSIT");
    }

    private String normalizeProductType(String productType) {
        if (productType == null) return "hardcover";
        return productType.trim().toLowerCase();
    }
}
