package com.example.demo.controller;

import com.example.demo.service.PokemonService;
import com.example.demo.model.PokemonResponse;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pokemon")
public class PokemonController {

    private final PokemonService service;

    public PokemonController(PokemonService service) {
        this.service = service;
    }

    @GetMapping("/{name}")
    public PokemonResponse getPokemon(@PathVariable String name) {
        System.out.println("Fetching Pokémon info for: " + name);
        return service.getPokemonInfo(name);
    }
}