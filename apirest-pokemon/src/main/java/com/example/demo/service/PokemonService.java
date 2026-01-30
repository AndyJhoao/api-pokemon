package com.example.demo.service;

import com.example.demo.model.EvolutionChainResponse;
import com.example.demo.model.PokemonResponse;
import com.example.demo.model.SpeciesResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PokemonService {

    private final String POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";
    private final String SPECIES_URL = "https://pokeapi.co/api/v2/pokemon-species/";

    public PokemonResponse getPokemonInfo(String name) {
        String sanitized = name.toLowerCase().replaceAll("[^a-z0-9-]", "");
        if (sanitized.isEmpty()) {
            throw new IllegalArgumentException("Invalid pokemon name");
        }
        RestTemplate restTemplate = new RestTemplate();
        try {
            PokemonResponse response = restTemplate.getForObject(POKEAPI_URL + sanitized, PokemonResponse.class);

            // Fetch species data for evolution chain and mega forms
            try {
                SpeciesResponse species = restTemplate.getForObject(SPECIES_URL + sanitized, SpeciesResponse.class);
                if (species != null) {
                    // Evolution chain
                    if (species.evolutionChain != null && species.evolutionChain.url != null) {
                        try {
                            EvolutionChainResponse evoChain = restTemplate.getForObject(
                                    species.evolutionChain.url, EvolutionChainResponse.class);
                            if (evoChain != null) {
                                response.setEvolutionTree(evoChain.toEvolutionTree());
                            }
                        } catch (Exception e) {
                            // Evolution chain fetch failed, continue without it
                        }
                    }

                    // Mega evolutions from varieties
                    if (species.varieties != null) {
                        List<String> megas = species.varieties.stream()
                                .filter(v -> !v.isDefault && v.pokemon.name.contains("mega"))
                                .map(v -> v.pokemon.name)
                                .collect(Collectors.toList());
                        if (!megas.isEmpty()) {
                            response.setMegaEvolutions(megas);
                        }
                    }
                }
            } catch (Exception e) {
                // Species fetch failed, continue with basic pokemon data
            }

            return response;
        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("Pokémon not found: " + sanitized);
        }
    }
}
