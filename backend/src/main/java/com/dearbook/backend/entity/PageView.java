package com.dearbook.backend.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "page_views")
public class PageView {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "visited_at", nullable = false, updatable = false)
    private OffsetDateTime visitedAt;

    @Column(name = "page", length = 255)
    private String page;

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @PrePersist
    protected void onCreate() {
        if (visitedAt == null) {
            visitedAt = OffsetDateTime.now();
        }
    }

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public OffsetDateTime getVisitedAt() { return visitedAt; }
    public void setVisitedAt(OffsetDateTime visitedAt) { this.visitedAt = visitedAt; }

    public String getPage() { return page; }
    public void setPage(String page) { this.page = page; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getUserAgent() { return userAgent; }
    public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
}
