package com.dearbook.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Profile user;

    @ManyToOne
    @JoinColumn(name = "user_book_id")
    private UserBook userBook;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "email")
    private String email;

    @Column(name = "quantity")
    private Integer quantity = 1;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "collection_name")
    private String collectionName;

    @Column(name = "product_type")
    private String productType;

    @Column(name = "product_size")
    private String productSize;

    @Column(name = "custom_pages")
    private Integer customPages;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "selected_page_ids", columnDefinition = "jsonb")
    private String selectedPageIds;

    @Column(name = "pdf_file_name")
    private String pdfFileName;

    @Column(name = "pdf_file_data", columnDefinition = "TEXT")
    private String pdfFileData;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    private String status = "PENDING";

    @Column(name = "created_at", updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Profile getUser() { return user; }
    public void setUser(Profile user) { this.user = user; }

    public UserBook getUserBook() { return userBook; }
    public void setUserBook(UserBook userBook) { this.userBook = userBook; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }

    public String getCollectionName() { return collectionName; }
    public void setCollectionName(String collectionName) { this.collectionName = collectionName; }

    public String getProductType() { return productType; }
    public void setProductType(String productType) { this.productType = productType; }

    public String getProductSize() { return productSize; }
    public void setProductSize(String productSize) { this.productSize = productSize; }

    public Integer getCustomPages() { return customPages; }
    public void setCustomPages(Integer customPages) { this.customPages = customPages; }

    public String getSelectedPageIds() { return selectedPageIds; }
    public void setSelectedPageIds(String selectedPageIds) { this.selectedPageIds = selectedPageIds; }

    public String getPdfFileName() { return pdfFileName; }
    public void setPdfFileName(String pdfFileName) { this.pdfFileName = pdfFileName; }

    public String getPdfFileData() { return pdfFileData; }
    public void setPdfFileData(String pdfFileData) { this.pdfFileData = pdfFileData; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }

    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}