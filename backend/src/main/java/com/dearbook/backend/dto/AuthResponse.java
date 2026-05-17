package com.dearbook.backend.dto;

public class AuthResponse {
    private String token;
    private ProfileDto user;

    public AuthResponse(String token, ProfileDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ProfileDto getUser() {
        return user;
    }

    public void setUser(ProfileDto user) {
        this.user = user;
    }
}
