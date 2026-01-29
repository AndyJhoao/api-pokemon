package com.example.demo.service;

import com.example.demo.dto.*;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setDisplayName(request.getDisplayName() != null ? request.getDisplayName() : request.getEmail());
        user.setGuest(false);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.isGuest());
        return new AuthResponse(token, user.getDisplayName(), user.getEmail(), false);
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.isGuest());
        return new AuthResponse(token, user.getDisplayName(), user.getEmail(), user.isGuest());
    }

    public AuthResponse guestLogin() {
        String guestEmail = "guest_" + UUID.randomUUID() + "@pokemon.local";
        User user = new User();
        user.setEmail(guestEmail);
        user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        user.setDisplayName("Trainer");
        user.setGuest(true);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.isGuest());
        return new AuthResponse(token, user.getDisplayName(), user.getEmail(), true);
    }

    public ProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new ProfileResponse(user.getEmail(), user.getDisplayName(), user.getFavoritePokemon(), user.getProfilePokemon(), user.isGuest());
    }

    public ProfileResponse updateProfile(String email, ProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getFavoritePokemon() != null) {
            user.setFavoritePokemon(request.getFavoritePokemon());
        }
        if (request.getProfilePokemon() != null) {
            user.setProfilePokemon(request.getProfilePokemon());
        }
        userRepository.save(user);
        return new ProfileResponse(user.getEmail(), user.getDisplayName(), user.getFavoritePokemon(), user.getProfilePokemon(), user.isGuest());
    }
}
