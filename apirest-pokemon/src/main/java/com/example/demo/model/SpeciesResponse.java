package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SpeciesResponse {

    @JsonProperty("evolution_chain")
    public EvolutionChainRef evolutionChain;

    @JsonProperty("varieties")
    public List<Variety> varieties;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EvolutionChainRef {
        public String url;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Variety {
        @JsonProperty("is_default")
        public boolean isDefault;
        public VarietyPokemon pokemon;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VarietyPokemon {
        public String name;
        public String url;
    }
}
