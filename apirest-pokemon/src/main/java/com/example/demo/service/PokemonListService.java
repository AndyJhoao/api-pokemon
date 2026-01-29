package com.example.demo.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PokemonListService {

    private List<String> allPokemonNames = new ArrayList<>();

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class PokemonListResponse {
        public List<PokemonEntry> results;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class PokemonEntry {
        public String name;
    }

    @PostConstruct
    public void init() {
        try {
            RestTemplate restTemplate = new RestTemplate();
            PokemonListResponse response = restTemplate.getForObject(
                    "https://pokeapi.co/api/v2/pokemon?limit=1302", PokemonListResponse.class);
            if (response != null && response.results != null) {
                allPokemonNames = response.results.stream()
                        .map(e -> e.name)
                        .collect(Collectors.toList());
            }
            System.out.println("Cached " + allPokemonNames.size() + " Pokémon names");
        } catch (Exception e) {
            System.err.println("Failed to fetch Pokémon list: " + e.getMessage());
        }
    }

    public List<String> search(String query) {
        String q = query.toLowerCase();
        return allPokemonNames.stream()
                .filter(name -> name.contains(q))
                .limit(10)
                .collect(Collectors.toList());
    }
}
