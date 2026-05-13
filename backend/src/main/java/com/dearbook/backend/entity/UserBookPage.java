package com.dearbook.backend.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "user_book_pages")
public class UserBookPage {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne @JoinColumn(name = "user_book_id") private UserBook userBook;
    @ManyToOne @JoinColumn(name = "template_page_id") private TemplatePage templatePage;
    @Column(name = "page_number") private Integer pageNumber;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "user_content", columnDefinition = "jsonb") private String userContent;
    @Column(name = "created_at", insertable = false, updatable = false) private OffsetDateTime createdAt;
    @Column(name = "updated_at", insertable = false, updatable = false) private OffsetDateTime updatedAt;
    // Getters and Setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public UserBook getUserBook() { return userBook; } public void setUserBook(UserBook userBook) { this.userBook = userBook; }
    public TemplatePage getTemplatePage() { return templatePage; } public void setTemplatePage(TemplatePage templatePage) { this.templatePage = templatePage; }
    public Integer getPageNumber() { return pageNumber; } public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }
    public String getUserContent() { return userContent; } public void setUserContent(String userContent) { this.userContent = userContent; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; } public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
