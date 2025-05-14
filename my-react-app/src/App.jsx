import { useState, useEffect } from 'react';

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [pokemonName, setPokemonName] = useState('pikachu');

  const fetchPokemon = async (name) => {
    try {
      const response = await fetch(`/api/pokemon/${name}`);
      if (!response.ok) throw new Error('No se encontró el Pokémon');
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setPokemon(null);
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchPokemon(pokemonName);
  }, []);

   return (
    <div className="App">
      <input
        type="text"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
        placeholder="Enter Pokémon name"
      />
      <button onClick={() => fetchPokemon(pokemonName)}>Search</button>

      {pokemon && (
        <div>
          <h2>{pokemon.name}</h2>
          <img src={pokemon.sprites} alt={pokemon.name} />
          <p>Types: {pokemon.types.join(', ')}</p>
          <p>Stats:</p>
          <ul>
            {pokemon.stats.map((stat, index) => (
              <li key={index}>{stat}</li>
            ))}
          </ul>
          <p>Abilities: {pokemon.abilities.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

export default App;