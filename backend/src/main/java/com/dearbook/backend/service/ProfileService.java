package com.dearbook.backend.service;

import com.dearbook.backend.entity.Profile;
import com.dearbook.backend.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class ProfileService {
    private final ProfileRepository profileRepo;

    public ProfileService(ProfileRepository profileRepo) {
        this.profileRepo = profileRepo;
    }

    public Profile getProfile(UUID id) {
        return profileRepo.findById(id).orElseThrow();
    }

    public Profile createOrUpdate(Profile profile) {
        // Simple logic for MVP
        return profileRepo.save(profile);
    }
    
    public Optional<Profile> findByEmail(String email) {
        return profileRepo.findAll().stream()
                .filter(p -> email.equals(p.getEmail()))
                .findFirst();
    }
}
