package com.dearbook.backend.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "orders")
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne @JoinColumn(name = "user_id") private Profile user;
    @ManyToOne @JoinColumn(name = "user_book_id") private UserBook userBook;
    @Column(name = "total_amount") private BigDecimal totalAmount;
    private String status = "PENDING";
    @Column(name = "created_at", insertable = false, updatable = false) private OffsetDateTime createdAt;
    @Column(name = "updated_at", insertable = false, updatable = false) private OffsetDateTime updatedAt;
    @Column(name = "selected_page_ids", columnDefinition = "jsonb") private String selectedPageIds;
    // Getters and setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public Profile getUser() { return user; } public void setUser(Profile user) { this.user = user; }
    public UserBook getUserBook() { return userBook; } public void setUserBook(UserBook userBook) { this.userBook = userBook; }
    public BigDecimal getTotalAmount() { return totalAmount; } public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getSelectedPageIds() { return selectedPageIds; } public void setSelectedPageIds(String selectedPageIds) { this.selectedPageIds = selectedPageIds; }
}
