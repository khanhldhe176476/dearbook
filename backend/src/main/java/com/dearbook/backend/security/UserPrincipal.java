package com.dearbook.backend.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

public class UserPrincipal implements UserDetails {

    private final UUID id;
    private final Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(UUID id, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.authorities = authorities;
    }

    public static UserPrincipal create(UUID id) {
        return new UserPrincipal(id, Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_USER")));
    }

    public static UserPrincipal createAdmin() {
        return new UserPrincipal(null, Collections.singletonList(new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_ADMIN")));
    }

    public UUID getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null; // Using token authentication, no password needed
    }

    @Override
    public String getUsername() {
        return id == null ? "admin" : id.toString();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

