package com.dearbook.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtProvider {

    @Value("${app.jwt.secret:your-256-bit-secret-your-256-bit-secret-for-local-dev-only}")
    private String jwtSecret;

    @Value("${app.admin.jwt.secret:dearbook-admin-secret-key-32chars!!}")
    private String adminJwtSecret;

    @Value("${app.jwt.expiration-ms:86400000}") // Default 1 day
    private int jwtExpirationMs;

    public String generateToken(UUID userId) {
        return generateToken(userId.toString());
    }

    public String generateToken(String subject) {
        String secret = "admin".equals(subject) ? adminJwtSecret : jwtSecret;
        Key key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }
}
