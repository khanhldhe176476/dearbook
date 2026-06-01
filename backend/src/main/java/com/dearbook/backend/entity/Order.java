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

    // Customer info (collected from the order form — may differ from profile)
    @Column(name = "customer_name") private String customerName;
    @Column(name = "email") private String email;

    // Order details
    @Column(name = "quantity") private Integer quantity = 1;
    @Column(name = "note", columnDefinition = "TEXT") private String note;
    @Column(name = "collection_name") private String collectionName;
    @Column(name = "product_type") private String productType;    // e.g. softcover, hardcover, layflat
    @Column(name = "product_size") private String productSize;    // e.g. A4, 20x20
    @Column(name = "custom_pages") private Integer customPages;   // user-selected page count

    @Column(name = "total_amount") private BigDecimal totalAmount;
    private String status = "PENDING";
    @Column(name = "created_at", insertable = false, updatable = false) private OffsetDateTime createdAt;
    @Column(name = "updated_at", insertable = false, updatable = false) private OffsetDateTime updatedAt;

    // Getters and setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public Profile getUser() { return user; } public void setUser(Profile user) { this.user = user; }
    public UserBook getUserBook() { return userBook; } public void setUserBook(UserBook userBook) { this.userBook = userBook; }
    public String getCustomerName() { return customerName; } public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public Integer getQuantity() { return quantity; } public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getNote() { return note; } public void setNote(String note) { this.note = note; }
    public String getCollectionName() { return collectionName; } public void setCollectionName(String collectionName) { this.collectionName = collectionName; }
    public String getProductType() { return productType; } public void setProductType(String productType) { this.productType = productType; }
    public String getProductSize() { return productSize; } public void setProductSize(String productSize) { this.productSize = productSize; }
    public Integer getCustomPages() { return customPages; } public void setCustomPages(Integer customPages) { this.customPages = customPages; }
    public BigDecimal getTotalAmount() { return totalAmount; } public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
