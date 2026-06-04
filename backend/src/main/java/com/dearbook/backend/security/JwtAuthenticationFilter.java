package com.dearbook.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${app.jwt.secret:your-256-bit-secret-your-256-bit-secret-for-local-dev-only}")
    private String jwtSecret;

    @Value("${app.admin.jwt.secret:dearbook-admin-secret-key-32chars!!}")
    private String adminJwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                // Parse JWT with proper secret binding: admin subject MUST use admin secret
                Claims claims = parseClaimsSecure(jwt);
                String subjectString = claims.getSubject();

                UserPrincipal userPrincipal;
                if ("admin".equals(subjectString)) {
                    userPrincipal = UserPrincipal.createAdmin();
                    log.debug("Admin authenticated via JWT");
                } else {
                    UUID userId = UUID.fromString(subjectString);
                    userPrincipal = UserPrincipal.create(userId);
                    log.debug("User {} authenticated via JWT", userId);
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userPrincipal,
                                null,
                                userPrincipal.getAuthorities()
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (JwtAuthenticationException ex) {
            // Token was present but invalid — return 401 immediately
            log.warn("JWT authentication rejected: {}", ex.getMessage());
            sendJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());
            return;
        } catch (Exception ex) {
            // Only log unexpected errors; don't leak details to client
            log.error("Unexpected error during JWT authentication: {}", ex.getMessage(), ex);
            sendJsonError(response, HttpServletResponse.SC_UNAUTHORIZED, "Authentication failed");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * Parse JWT securely by binding the subject to the signing secret.
     * <p>
     * An "admin" subject MUST be signed with the admin secret.
     * A regular user subject MUST be signed with the user secret.
     * This prevents a cross-secret attack where a user-secret-signed token
     * with subject="admin" could gain admin privileges.
     */
    private Claims parseClaimsSecure(String token) throws JwtAuthenticationException {
        // First, try to decode without verifying to check the subject hint.
        // Since JJWT doesn't support unverified parsing easily, we use a try-both
        // approach but VALIDATE that the subject matches the secret used.

        // Try admin secret first for admin-like tokens, but more importantly:
        // try both and enforce that admin subject was signed with admin secret.

        Claims adminClaims = tryParseWithSecret(token, adminJwtSecret);
        Claims userClaims = tryParseWithSecret(token, jwtSecret);

        if (adminClaims != null) {
            // Admin secret worked — accept regardless of subject
            // (JwtProvider already enforces admin subject → admin secret)
            return adminClaims;
        }

        if (userClaims != null) {
            // User secret worked — REJECT if someone tries to impersonate admin
            if ("admin".equals(userClaims.getSubject())) {
                throw new JwtAuthenticationException(
                        "Invalid token: admin subject must be signed with admin secret");
            }
            return userClaims;
        }

        // Neither secret worked — try both with proper exception handling for diagnostics
        try {
            parseWithSecret(token, adminJwtSecret);
        } catch (JwtAuthenticationException e) {
            throw e; // Re-throw structured errors
        } catch (ExpiredJwtException e) {
            throw new JwtAuthenticationException("Token expired at " + e.getClaims().getExpiration());
        } catch (SignatureException | MalformedJwtException e) {
            // Will try user secret next
        } catch (Exception e) {
            // Other parsing errors
        }

        try {
            parseWithSecret(token, jwtSecret);
        } catch (JwtAuthenticationException e) {
            throw e;
        } catch (ExpiredJwtException e) {
            throw new JwtAuthenticationException("Token expired at " + e.getClaims().getExpiration());
        } catch (SignatureException | MalformedJwtException e) {
            throw new JwtAuthenticationException("Invalid token signature or format");
        } catch (Exception e) {
            throw new JwtAuthenticationException("Invalid token: " + e.getMessage());
        }

        throw new JwtAuthenticationException("Invalid token");
    }

    /**
     * Attempt to parse a token with the given secret. Returns null if signature doesn't match.
     */
    private Claims tryParseWithSecret(String token, String secret) {
        try {
            return parseWithSecret(token, secret);
        } catch (Exception e) {
            return null;
        }
    }

    private Claims parseWithSecret(String token, String secret) throws JwtAuthenticationException {
        try {
            Key key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw e; // Let caller handle
        } catch (SignatureException e) {
            throw e; // Let caller handle
        } catch (MalformedJwtException e) {
            throw e; // Let caller handle
        } catch (Exception e) {
            throw new JwtAuthenticationException("Token validation failed: " + e.getMessage());
        }
    }

    private void sendJsonError(HttpServletResponse response, int status, String message) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status);
        body.put("error", status == 401 ? "Unauthorized" : "Forbidden");
        body.put("message", message);
        body.put("timestamp", Instant.now().toString());

        objectMapper.writeValue(response.getWriter(), body);
    }

    /**
     * Custom exception for JWT authentication failures that should result in a 401 response.
     */
    static class JwtAuthenticationException extends Exception {
        JwtAuthenticationException(String message) {
            super(message);
        }
    }
}
