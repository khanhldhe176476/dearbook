package com.dearbook.backend.dto;

import java.util.UUID;

public class ProfileDto {
    private UUID id;
    private String email;
    private String fullName;
    private String avatarUrl;

    public ProfileDto() {}

    public ProfileDto(UUID id, String email, String fullName, String avatarUrl) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
}
