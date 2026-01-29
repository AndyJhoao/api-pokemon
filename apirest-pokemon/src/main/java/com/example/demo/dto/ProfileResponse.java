package com.example.demo.dto;

public class ProfileResponse {
    private String email;
    private String displayName;
    private String favoritePokemon;
    private String profilePokemon;
    private boolean guest;

    public ProfileResponse(String email, String displayName, String favoritePokemon, String profilePokemon, boolean guest) {
        this.email = email;
        this.displayName = displayName;
        this.favoritePokemon = favoritePokemon;
        this.profilePokemon = profilePokemon;
        this.guest = guest;
    }

    public String getEmail() { return email; }
    public String getDisplayName() { return displayName; }
    public String getFavoritePokemon() { return favoritePokemon; }
    public String getProfilePokemon() { return profilePokemon; }
    public boolean isGuest() { return guest; }
}
