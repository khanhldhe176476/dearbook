package com.dearbook.backend.repository;

import com.dearbook.backend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    List<Payment> findByOrderId(UUID orderId);

    @Modifying
    @Query("UPDATE Payment p SET p.status = :status WHERE p.order.id = :orderId")
    int updateStatusByOrderId(UUID orderId, String status);

    @Modifying
    @Query("DELETE FROM Payment p WHERE p.order.id = :orderId")
    void deleteByOrderId(UUID orderId);
}
