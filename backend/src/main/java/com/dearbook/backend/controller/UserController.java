package com.dearbook.backend.controller;

import com.dearbook.backend.dto.ProfileDto;
import com.dearbook.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getCurrentUser() {
        ProfileDto profile = userService.getCurrentUserProfile();
        return ResponseEntity.ok(profile);
    }
}
