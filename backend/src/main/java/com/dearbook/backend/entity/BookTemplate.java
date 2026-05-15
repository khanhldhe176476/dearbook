package com.dearbook.backend.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "book_templates")
public class BookTemplate {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne @JoinColumn(name = "category_id") private BookCategory category;
    private String name;
    private String description;
    @Column(name = "cover_image_url") private String coverImageUrl;
    private BigDecimal price;
    @Column(name = "is_active") private Boolean active;
    @Column(name = "created_at", insertable = false, updatable = false) private OffsetDateTime createdAt;
    // Getters and Setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public BookCategory getCategory() { return category; } public void setCategory(BookCategory category) { this.category = category; }
    public String getName() { return name; } public void setName(String name) { this.name = name; }
    public String getDescription() { return description; } public void setDescription(String description) { this.description = description; }
    public String getCoverImageUrl() { return coverImageUrl; } public void setCoverImageUrl(String coverImageUrl) { this.coverImageUrl = coverImageUrl; }
    public BigDecimal getPrice() { return price; } public void setPrice(BigDecimal price) { this.price = price; }
    public Boolean getActive() { return active; } public void setActive(Boolean active) { this.active = active; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
