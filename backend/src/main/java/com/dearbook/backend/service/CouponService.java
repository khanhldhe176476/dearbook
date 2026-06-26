package com.dearbook.backend.service;

import com.dearbook.backend.entity.Coupon;
import com.dearbook.backend.repository.CouponRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.Map;

@Service
public class CouponService {

    private static final Logger log = LoggerFactory.getLogger(CouponService.class);

    private final CouponRepository couponRepo;

    public CouponService(CouponRepository couponRepo) {
        this.couponRepo = couponRepo;
    }

    /**
     * Validate a coupon code and calculate the discount amount.
     *
     * @param code       the coupon code to validate
     * @param orderTotal the current order total (before discount)
     * @return a Map with: valid (boolean), discountAmount (BigDecimal), finalTotal (BigDecimal), message (String)
     */
    public Map<String, Object> validate(String code, BigDecimal orderTotal) {
        if (code == null || code.isBlank()) {
            return Map.of("valid", false, "message", "Vui lòng nhập mã giảm giá.");
        }

        Coupon coupon = couponRepo.findByCode(code.trim().toUpperCase()).orElse(null);

        // 1. Mã không tồn tại
        if (coupon == null) {
            return Map.of("valid", false, "message", "Mã giảm giá không tồn tại.");
        }

        // 2. Mã không active
        if (coupon.getIsActive() == null || !coupon.getIsActive()) {
            return Map.of("valid", false, "message", "Mã giảm giá đã bị vô hiệu hóa.");
        }

        // 3. Mã chưa tới ngày áp dụng
        if (coupon.getStartsAt() != null && coupon.getStartsAt().isAfter(OffsetDateTime.now())) {
            return Map.of("valid", false, "message", "Mã giảm giá chưa có hiệu lực.");
        }

        // 4. Mã đã hết hạn
        if (coupon.getExpiresAt() != null && coupon.getExpiresAt().isBefore(OffsetDateTime.now())) {
            return Map.of("valid", false, "message", "Mã giảm giá đã hết hạn.");
        }

        // 5. Mã đã hết lượt dùng
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() != null
                && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return Map.of("valid", false, "message", "Mã giảm giá đã hết lượt sử dụng.");
        }

        // 6. Tính discount
        BigDecimal discountAmount = calculateDiscount(coupon, orderTotal);

        if (discountAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return Map.of("valid", false, "message", "Không thể áp dụng mã cho đơn hàng này.");
        }

        BigDecimal finalTotal = orderTotal.subtract(discountAmount).max(BigDecimal.ZERO);

        log.info("Coupon {} validated: discountType={}, discountValue={}, orderTotal={}, discountAmount={}, finalTotal={}",
                coupon.getCode(), coupon.getDiscountType(), coupon.getDiscountValue(),
                orderTotal, discountAmount, finalTotal);

        return Map.of(
                "valid", true,
                "code", coupon.getCode(),
                "discountType", coupon.getDiscountType(),
                "discountAmount", discountAmount,
                "finalTotal", finalTotal,
                "message", String.format("Áp dụng mã %s thành công! Giảm %,.0f ₫", coupon.getCode(), discountAmount)
        );
    }

    /**
     * Atomically increment the used_count of a coupon.
     * Only increments if usage limit has not been reached yet.
     *
     * @return true if the count was successfully incremented
     */
    @Transactional
    public boolean apply(String code) {
        if (code == null || code.isBlank()) return false;

        Coupon coupon = couponRepo.findByCode(code.trim().toUpperCase()).orElse(null);
        if (coupon == null) return false;

        int updated = couponRepo.incrementUsedCount(coupon.getId());
        return updated > 0;
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderTotal) {
        return switch (coupon.getDiscountType().toUpperCase()) {
            case "FIXED" -> {
                // Fixed amount: không vượt quá orderTotal
                yield coupon.getDiscountValue().min(orderTotal);
            }
            case "PERCENT" -> {
                // Percentage: orderTotal * percent / 100
                BigDecimal percentDiscount = orderTotal.multiply(coupon.getDiscountValue())
                        .divide(BigDecimal.valueOf(100), 0, RoundingMode.HALF_UP);
                // Capped at max_discount if set, không vượt quá orderTotal
                if (coupon.getMaxDiscount() != null) {
                    percentDiscount = percentDiscount.min(coupon.getMaxDiscount());
                }
                yield percentDiscount.min(orderTotal);
            }
            default -> BigDecimal.ZERO;
        };
    }
}
