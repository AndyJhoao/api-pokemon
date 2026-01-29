package com.example.demo.controller;

import com.example.demo.service.PokemonService;
import com.example.demo.service.PokemonListService;
import com.example.demo.model.PokemonResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class PokemonController {

    private static final java.util.regex.Pattern VALID_NAME = java.util.regex.Pattern.compile("^[a-zA-Z0-9-]{1,50}$");

    private final PokemonService service;
    private final PokemonListService pokemonListService;

    public PokemonController(PokemonService service, PokemonListService pokemonListService) {
        this.service = service;
        this.pokemonListService = pokemonListService;
    }

    @GetMapping("/api/pokemon/{name}")
    public PokemonResponse getPokemon(@PathVariable String name) {
        if (!VALID_NAME.matcher(name).matches()) {
            throw new IllegalArgumentException("Invalid pokemon name");
        }
        return service.getPokemonInfo(name);
    }

    @GetMapping("/api/pokemon-list")
    public List<String> searchPokemon(@RequestParam String q) {
        if (q == null || q.length() > 50) {
            throw new IllegalArgumentException("Invalid search query");
        }
        return pokemonListService.search(q);
    }
}
