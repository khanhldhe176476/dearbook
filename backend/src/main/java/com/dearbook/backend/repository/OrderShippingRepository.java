package com.dearbook.backend.repository;

import com.dearbook.backend.entity.OrderShipping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderShippingRepository extends JpaRepository<OrderShipping, UUID> {
    Optional<OrderShipping> findByOrderId(UUID orderId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("DELETE FROM OrderShipping os WHERE os.order.id = :orderId")
    void deleteByOrderId(UUID orderId);
}
