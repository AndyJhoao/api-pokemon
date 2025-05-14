package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import java.util.stream.Collectors;

@JsonIgnoreProperties(ignoreUnknown = true)
public class PokemonResponse {
    private String name;

    @JsonProperty("abilities")
    private List<AbilityWrapper> abilityWrappers;

    @JsonProperty("moves")
    private List<MoveWrapper> moveWrappers;

    @JsonProperty("types")
    private List<TypeWrapper> typeWrappers;

    @JsonProperty("stats")
    private List<StatWrapper> statWrappers;

    @JsonProperty("sprites")
    private Sprites sprites;

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class Sprites {
        @JsonProperty("front_default")
        public String front_default;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class AbilityWrapper {
        public Ability ability;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class Ability {
        public String name;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class Move {
        public String name;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class MoveWrapper {
        public Move move;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class TypeWrapper {
        public Type type;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class Type {
        public String name;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class StatWrapper {
        public int base_stat;
        public Stat stat;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class Stat {
        public String name;
    }

    public List<String> getAbilities() {
        return abilityWrappers.stream()
                .map(wrapper -> wrapper.ability.name)
                .collect(Collectors.toList());
    }

    public List<String> getMoves() {
        return moveWrappers.stream()
                .map(wrapper -> wrapper.move.name)
                .collect(Collectors.toList());
    }

    public List<String> getTypes() {
        return typeWrappers.stream()
                .map(wrapper -> wrapper.type.name)
                .collect(Collectors.toList());
    }

    public List<String> getStats() {
        return statWrappers.stream()
                .map(wrapper -> wrapper.stat.name + ": " + wrapper.base_stat)
                .collect(Collectors.toList());
    }

    public String getName() {
        return name;
    }

    public String getSprites() {
        return sprites.front_default;
    }
}