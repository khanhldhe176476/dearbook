package com.dearbook.backend.controller;

import com.dearbook.backend.dto.AuthResponse;
import com.dearbook.backend.dto.GoogleLoginRequest;
import com.dearbook.backend.security.JwtProvider;
import com.dearbook.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtProvider jwtProvider;

    public AuthController(AuthService authService, JwtProvider jwtProvider) {
        this.authService = authService;
        this.jwtProvider = jwtProvider;
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
        AuthResponse response = authService.authenticateGoogleUser(request.getIdToken());
        return ResponseEntity.ok(response);
    }

    /**
     * Issue a backend JWT token for a user after they have authenticated via Supabase.
     * <p>
     * IMPORTANT: In production, you MUST validate the Supabase access token server-side
     * before issuing a backend JWT. Currently this trusts the client-provided userId.
     * See: https://supabase.com/docs/guides/auth/auth-deep-dive/jwts
     */
    @PostMapping("/token")
    public ResponseEntity<Map<String, String>> issueToken(@RequestBody Map<String, String> body) {
        String userIdStr = body.get("userId");
        if (userIdStr == null || userIdStr.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "userId is required"));
        }

        UUID userId;
        try {
            userId = UUID.fromString(userIdStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "userId must be a valid UUID"));
        }

        String token = jwtProvider.generateToken(userId);
        return ResponseEntity.ok(Map.of("token", token, "userId", userId.toString()));
    }
}
