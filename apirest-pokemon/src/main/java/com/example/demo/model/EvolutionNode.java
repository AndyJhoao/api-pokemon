package com.example.demo.model;

import java.util.List;

/**
 * Tree-structured evolution node for JSON serialization.
 * Frontend uses this to determine layout: linear, fork (<), or circular (eevee).
 */
public class EvolutionNode {
    private String name;
    private String condition;
    private List<EvolutionNode> evolvesTo;

    public EvolutionNode() {}

    public EvolutionNode(String name, String condition, List<EvolutionNode> evolvesTo) {
        this.name = name;
        this.condition = condition;
        this.evolvesTo = evolvesTo;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public List<EvolutionNode> getEvolvesTo() { return evolvesTo; }
    public void setEvolvesTo(List<EvolutionNode> evolvesTo) { this.evolvesTo = evolvesTo; }
}
