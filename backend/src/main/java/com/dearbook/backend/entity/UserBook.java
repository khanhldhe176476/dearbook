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
    private String title;
    private String status = "DRAFT";
    @Column(name = "created_at", insertable = false, updatable = false) private OffsetDateTime createdAt;
    @Column(name = "updated_at", insertable = false, updatable = false) private OffsetDateTime updatedAt;
    // Getters and Setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public Profile getUser() { return user; } public void setUser(Profile user) { this.user = user; }
    public BookTemplate getTemplate() { return template; } public void setTemplate(BookTemplate template) { this.template = template; }
    public String getTitle() { return title; } public void setTitle(String title) { this.title = title; }
    public String getStatus() { return status; } public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
