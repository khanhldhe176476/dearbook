package com.dearbook.backend.config;

import com.dearbook.backend.entity.Coupon;
import com.dearbook.backend.repository.CouponRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Seeds coupon data on startup only if a coupon code does NOT already exist.
 * Safe to run repeatedly — skips existing codes instead of throwing duplicate-key errors.
 * Works with both H2 (local dev) and PostgreSQL (production).
 */
@Component
public class CouponDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(CouponDataSeeder.class);

    private final CouponRepository couponRepo;

    public CouponDataSeeder(CouponRepository couponRepo) {
        this.couponRepo = couponRepo;
    }

    @Override
    public void run(String... args) {
        List<Coupon> toSeed = List.of(
            createCoupon("GIAM20K", "FIXED", 20000, 0, null, 100),
            createCoupon("GIAM15", "PERCENT", 15, 100_000, 50_000, 100),
            createCoupon("GIAM20", "PERCENT", 20, 200_000, 80_000, 50)
        );

        int seeded = 0;
        for (Coupon c : toSeed) {
            Optional<Coupon> existing = couponRepo.findByCode(c.getCode());
            if (existing.isPresent()) {
                log.info("Coupon '{}' already exists — skipping.", c.getCode());
            } else {
                couponRepo.save(c);
                seeded++;
                log.info("Coupon '{}' seeded successfully.", c.getCode());
            }
        }

        log.info("Coupon seeding complete: {} new, {} skipped (already exist).",
                seeded, toSeed.size() - seeded);
    }

    private Coupon createCoupon(String code, String discountType, int discountValue,
                                int minOrderAmount, Integer maxDiscount, int usageLimit) {
        Coupon c = new Coupon();
        c.setCode(code);
        c.setDiscountType(discountType);
        c.setDiscountValue(BigDecimal.valueOf(discountValue));
        c.setMinOrderAmount(BigDecimal.valueOf(minOrderAmount));
        c.setMaxDiscount(maxDiscount != null ? BigDecimal.valueOf(maxDiscount) : null);
        c.setUsageLimit(usageLimit);
        c.setUsedCount(0);
        c.setIsActive(true);
        c.setStartsAt(OffsetDateTime.parse("2026-01-01T00:00:00+00:00"));
        c.setExpiresAt(OffsetDateTime.parse("2027-12-31T23:59:59+00:00"));
        return c;
    }
}
