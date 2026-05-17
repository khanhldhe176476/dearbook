package com.dearbook.backend.service;

import com.dearbook.backend.dto.AuthResponse;
import com.dearbook.backend.dto.ProfileDto;
import com.dearbook.backend.entity.Profile;
import com.dearbook.backend.repository.ProfileRepository;
import com.dearbook.backend.security.JwtProvider;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final ProfileRepository profileRepository;
    private final JwtProvider jwtProvider;
    private final String googleClientId;

    public AuthService(ProfileRepository profileRepository, JwtProvider jwtProvider,
                       @Value("${google.client-id}") String googleClientId) {
        this.profileRepository = profileRepository;
        this.jwtProvider = jwtProvider;
        this.googleClientId = googleClientId;
    }

    public AuthResponse authenticateGoogleUser(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                String email = payload.getEmail();
                String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");

                Optional<Profile> existingProfileOpt = profileRepository.findByEmail(email);
                Profile userProfile;

                if (existingProfileOpt.isPresent()) {
                    userProfile = existingProfileOpt.get();
                    // Optionally update name/picture if we want to sync with Google
                } else {
                    userProfile = new Profile();
                    userProfile.setId(UUID.randomUUID());
                    userProfile.setEmail(email);
                    userProfile.setFullName(name);
                    userProfile.setAvatarUrl(pictureUrl);
                    profileRepository.save(userProfile);
                }

                String token = jwtProvider.generateToken(userProfile.getId());

                ProfileDto profileDto = new ProfileDto(
                        userProfile.getId(),
                        userProfile.getEmail(),
                        userProfile.getFullName(),
                        userProfile.getAvatarUrl()
                );

                return new AuthResponse(token, profileDto);
            } else {
                throw new RuntimeException("Invalid Google ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Authentication failed: " + e.getMessage(), e);
        }
    }
}
