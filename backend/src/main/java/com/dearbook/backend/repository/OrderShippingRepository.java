package com.dearbook.backend.repository;

import com.dearbook.backend.entity.OrderShipping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrderShippingRepository extends JpaRepository<OrderShipping, UUID> {
    Optional<OrderShipping> findByOrderId(UUID orderId);
}
