package com.dearbook.backend.controller;

import com.dearbook.backend.dto.AuthResponse;
import com.dearbook.backend.dto.GoogleLoginRequest;
import com.dearbook.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleLoginRequest request) {
        AuthResponse response = authService.authenticateGoogleUser(request.getIdToken());
        return ResponseEntity.ok(response);
    }
}
