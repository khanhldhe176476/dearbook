package com.dearbook.backend.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @OneToOne @JoinColumn(name = "order_id") private Order order;
    private BigDecimal amount;
    @Column(name = "payment_method") private String paymentMethod;
    private String status = "PENDING";
    @Column(name = "transaction_id") private String transactionId;
    @Column(name = "created_at", updatable = false) private OffsetDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
    }

    // Getters and Setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public Order getOrder() { return order; } public void setOrder(Order order) { this.order = order; }
    public BigDecimal getAmount() { return amount; } public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getPaymentMethod() { return paymentMethod; } public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public String getTransactionId() { return transactionId; } public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
