package com.dearbook.backend.service;

import com.dearbook.backend.dto.ProfileDto;
import com.dearbook.backend.entity.Profile;
import com.dearbook.backend.exception.ResourceNotFoundException;
import com.dearbook.backend.exception.UnauthorizedException;
import com.dearbook.backend.repository.ProfileRepository;
import com.dearbook.backend.security.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private final ProfileRepository profileRepository;

    public UserService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public ProfileDto getCurrentUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User is not authenticated");
        }

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        UUID userId = userPrincipal.getId();

        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for ID: " + userId));

        return new ProfileDto(
                profile.getId(),
                profile.getEmail(),
                profile.getFullName(),
                profile.getAvatarUrl(),
                profile.getPhone(),
                profile.getAddress(),
                profile.getWard(),
                profile.getDistrict(),
                profile.getCity(),
                profile.getPostalCode(),
                profile.getShippingNote()
        );
    }
}
