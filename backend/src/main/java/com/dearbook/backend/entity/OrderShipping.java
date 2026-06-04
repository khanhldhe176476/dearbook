package com.dearbook.backend.entity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "order_shipping")
public class OrderShipping {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @OneToOne @JoinColumn(name = "order_id") private Order order;
    @Column(name = "recipient_name") private String recipientName;
    private String phone;
    private String address;
    private String city;
    @Column(name = "tracking_number") private String trackingNumber;
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
    public String getRecipientName() { return recipientName; } public void setRecipientName(String recipientName) { this.recipientName = recipientName; }
    public String getPhone() { return phone; } public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; } public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; } public void setCity(String city) { this.city = city; }
    public String getTrackingNumber() { return trackingNumber; } public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
