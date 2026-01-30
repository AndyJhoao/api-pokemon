package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class EvolutionChainResponse {

    public ChainLink chain;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChainLink {
        public Species species;

        @JsonProperty("evolution_details")
        public List<EvolutionDetail> evolutionDetails;

        @JsonProperty("evolves_to")
        public List<ChainLink> evolvesTo;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Species {
        public String name;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class EvolutionDetail {
        public NamedResource item;
        public NamedResource trigger;

        @JsonProperty("min_level")
        public Integer minLevel;

        @JsonProperty("min_happiness")
        public Integer minHappiness;

        @JsonProperty("held_item")
        public NamedResource heldItem;

        @JsonProperty("known_move")
        public NamedResource knownMove;

        @JsonProperty("known_move_type")
        public NamedResource knownMoveType;

        @JsonProperty("time_of_day")
        public String timeOfDay;

        public NamedResource location;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class NamedResource {
        public String name;
        public String url;
    }

    /**
     * Converts the chain into a tree of EvolutionNode for JSON serialization.
     */
    public EvolutionNode toEvolutionTree() {
        return convertLink(chain);
    }

    private EvolutionNode convertLink(ChainLink link) {
        if (link == null) return null;

        String condition = null;
        if (link.evolutionDetails != null && !link.evolutionDetails.isEmpty()) {
            condition = buildConditionText(link.evolutionDetails.get(0));
            if (condition.isEmpty()) condition = null;
        }

        List<EvolutionNode> children = new ArrayList<>();
        if (link.evolvesTo != null) {
            for (ChainLink next : link.evolvesTo) {
                children.add(convertLink(next));
            }
        }

        return new EvolutionNode(link.species.name, condition, children.isEmpty() ? null : children);
    }

    private String buildConditionText(EvolutionDetail detail) {
        List<String> conditions = new ArrayList<>();

        if (detail.trigger != null) {
            switch (detail.trigger.name) {
                case "level-up":
                    if (detail.minLevel != null) {
                        conditions.add("level " + detail.minLevel);
                    }
                    break;
                case "use-item":
                    if (detail.item != null) {
                        conditions.add("use " + detail.item.name);
                    }
                    break;
                case "trade":
                    conditions.add("trade");
                    break;
                default:
                    conditions.add(detail.trigger.name);
            }
        }

        if (detail.heldItem != null) {
            conditions.add("holding " + detail.heldItem.name);
        }
        if (detail.minHappiness != null) {
            conditions.add("happiness " + detail.minHappiness);
        }
        if (detail.timeOfDay != null && !detail.timeOfDay.isEmpty()) {
            conditions.add(detail.timeOfDay);
        }
        if (detail.knownMoveType != null) {
            conditions.add("knows " + detail.knownMoveType.name + "-type move");
        }
        if (detail.knownMove != null) {
            conditions.add("knows " + detail.knownMove.name);
        }
        if (detail.location != null) {
            conditions.add("at " + detail.location.name);
        }

        return String.join(", ", conditions);
    }
}
