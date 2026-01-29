package com.example.demo.controller;

import com.example.demo.dto.ProfileRequest;
import com.example.demo.dto.ProfileResponse;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileResponse> getProfile(Authentication auth) {
        return ResponseEntity.ok(userService.getProfile(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileResponse> updateProfile(Authentication auth,
                                                          @Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(auth.getName(), request));
    }
}
