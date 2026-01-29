package com.example.demo.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ProfileRequest {
    @Size(max = 50, message = "Display name must not exceed 50 characters")
    private String displayName;

    @Size(max = 50, message = "Favorite pokemon must not exceed 50 characters")
    @Pattern(regexp = "^$|^[a-zA-Z0-9-]+$", message = "Invalid pokemon name")
    private String favoritePokemon;

    @Size(max = 50, message = "Profile pokemon must not exceed 50 characters")
    @Pattern(regexp = "^$|^[a-zA-Z0-9-]+$", message = "Invalid pokemon name")
    private String profilePokemon;

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getFavoritePokemon() { return favoritePokemon; }
    public void setFavoritePokemon(String favoritePokemon) { this.favoritePokemon = favoritePokemon; }

    public String getProfilePokemon() { return profilePokemon; }
    public void setProfilePokemon(String profilePokemon) { this.profilePokemon = profilePokemon; }
}
