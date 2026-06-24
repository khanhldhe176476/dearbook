package com.dearbook.backend.repository;

import com.dearbook.backend.entity.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CouponRepository extends JpaRepository<Coupon, UUID> {

    Optional<Coupon> findByCode(String code);

    Optional<Coupon> findByCodeAndIsActiveTrue(String code);

    @Modifying
    @Query("UPDATE Coupon c SET c.usedCount = c.usedCount + 1 WHERE c.id = :id AND (c.usageLimit IS NULL OR c.usedCount < c.usageLimit)")
    int incrementUsedCount(UUID id);
}
