package com.example.demo.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;
    private String displayName;
    private String favoritePokemon;
    private String profilePokemon;
    private boolean guest;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getFavoritePokemon() { return favoritePokemon; }
    public void setFavoritePokemon(String favoritePokemon) { this.favoritePokemon = favoritePokemon; }

    public String getProfilePokemon() { return profilePokemon; }
    public void setProfilePokemon(String profilePokemon) { this.profilePokemon = profilePokemon; }

    public boolean isGuest() { return guest; }
    public void setGuest(boolean guest) { this.guest = guest; }
}
