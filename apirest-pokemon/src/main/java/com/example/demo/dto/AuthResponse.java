package com.example.demo.dto;

public class AuthResponse {
    private String token;
    private String displayName;
    private String email;
    private boolean guest;

    public AuthResponse(String token, String displayName, String email, boolean guest) {
        this.token = token;
        this.displayName = displayName;
        this.email = email;
        this.guest = guest;
    }

    public String getToken() { return token; }
    public String getDisplayName() { return displayName; }
    public String getEmail() { return email; }
    public boolean isGuest() { return guest; }
}
