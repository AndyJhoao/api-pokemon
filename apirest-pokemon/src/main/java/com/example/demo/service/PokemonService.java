package com.example.demo.service;

import com.example.demo.model.PokemonResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

@Service
public class PokemonService {

    private final String POKEAPI_URL = "https://pokeapi.co/api/v2/pokemon/";

    public PokemonResponse getPokemonInfo(String name) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            return restTemplate.getForObject(POKEAPI_URL + name.toLowerCase(), PokemonResponse.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("Pokémon no encontrado: " + name);
        }
    }
}