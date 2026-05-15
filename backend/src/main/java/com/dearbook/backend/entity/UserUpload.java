package com.dearbook.backend.entity;
import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "user_uploads")
public class UserUpload {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne @JoinColumn(name = "user_id") private Profile user;
    @Column(name = "file_url") private String fileUrl;
    @Column(name = "file_type") private String fileType;
    @Column(name = "created_at", insertable = false, updatable = false) private OffsetDateTime createdAt;
    // Getters and Setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public Profile getUser() { return user; } public void setUser(Profile user) { this.user = user; }
    public String getFileUrl() { return fileUrl; } public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public String getFileType() { return fileType; } public void setFileType(String fileType) { this.fileType = fileType; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
