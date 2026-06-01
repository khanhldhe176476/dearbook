package com.dearbook.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Value("${app.jwt.secret:your-256-bit-secret-your-256-bit-secret}")
    private String jwtSecret;

    @Value("${app.admin.jwt.secret:dearbook-admin-secret-key-32chars!!}")
    private String adminJwtSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt)) {
                Claims claims = parseClaims(jwt);
                String subjectString = claims.getSubject();

                UserPrincipal userPrincipal;
                if ("admin".equals(subjectString)) {
                    userPrincipal = UserPrincipal.createAdmin();
                } else {
                    UUID userId = UUID.fromString(subjectString);
                    userPrincipal = UserPrincipal.create(userId);
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
        } catch (Exception ex) {
            log.error("Could not set user authentication in security context: {}", ex.getMessage());
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

    private Claims parseClaims(String token) {
        try {
            return parseClaimsWithSecret(token, jwtSecret);
        } catch (Exception ignored) {
            return parseClaimsWithSecret(token, adminJwtSecret);
        }
    }

    private Claims parseClaimsWithSecret(String token, String secret) {
        Key key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
