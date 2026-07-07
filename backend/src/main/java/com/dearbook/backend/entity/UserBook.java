package com.dearbook.backend.entity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "user_books")
public class UserBook {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne @JoinColumn(name = "user_id") private Profile user;
    @ManyToOne @JoinColumn(name = "template_id") private BookTemplate template;
    @Column(name = "client_book_id") private String clientBookId;
    @Column(name = "client_template_id") private String clientTemplateId;
    private String title;
    private String status = "DRAFT";
    @Lob
    @Column(name = "book_data", columnDefinition = "text") private String bookData;
    @Column(name = "created_at") private OffsetDateTime createdAt;
    @Column(name = "updated_at") private OffsetDateTime updatedAt;

    @PrePersist
    void onCreate() {
        OffsetDateTime now = OffsetDateTime.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    // Getters and Setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public Profile getUser() { return user; } public void setUser(Profile user) { this.user = user; }
    public BookTemplate getTemplate() { return template; } public void setTemplate(BookTemplate template) { this.template = template; }
    public String getClientBookId() { return clientBookId; } public void setClientBookId(String clientBookId) { this.clientBookId = clientBookId; }
    public String getClientTemplateId() { return clientTemplateId; } public void setClientTemplateId(String clientTemplateId) { this.clientTemplateId = clientTemplateId; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public String getBookData() { return bookData; } public void setBookData(String bookData) { this.bookData = bookData; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
