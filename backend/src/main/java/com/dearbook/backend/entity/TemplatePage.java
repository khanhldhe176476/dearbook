package com.dearbook.backend.entity;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.OffsetDateTime;
import java.util.UUID;
@Entity
@Table(name = "template_pages")
public class TemplatePage {
    @Id @GeneratedValue(strategy = GenerationType.UUID) private UUID id;
    @ManyToOne @JoinColumn(name = "template_id") private BookTemplate template;
    @Column(name = "page_number") private Integer pageNumber;
    @Column(name = "layout_type") private String layoutType;
    @JdbcTypeCode(SqlTypes.JSON) @Column(name = "default_content", columnDefinition = "jsonb") private String defaultContent;
    @Column(name = "created_at", insertable = false, updatable = false) private OffsetDateTime createdAt;
    // Getters and setters
    public UUID getId() { return id; } public void setId(UUID id) { this.id = id; }
    public BookTemplate getTemplate() { return template; } public void setTemplate(BookTemplate template) { this.template = template; }
    public Integer getPageNumber() { return pageNumber; } public void setPageNumber(Integer pageNumber) { this.pageNumber = pageNumber; }
    public String getLayoutType() { return layoutType; } public void setLayoutType(String layoutType) { this.layoutType = layoutType; }
    public String getDefaultContent() { return defaultContent; } public void setDefaultContent(String defaultContent) { this.defaultContent = defaultContent; }
    public OffsetDateTime getCreatedAt() { return createdAt; } public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
