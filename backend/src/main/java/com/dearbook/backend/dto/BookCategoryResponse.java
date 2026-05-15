package com.dearbook.backend.dto;

import java.util.UUID;

public class BookCategoryResponse {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private Integer sortOrder;

    // Constructors
    public BookCategoryResponse() {}

    public BookCategoryResponse(UUID id, String name, String slug, String description, Integer sortOrder) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.sortOrder = sortOrder;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
