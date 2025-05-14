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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Pokémon Search</h1>

      <div className="flex gap-4 mb-10">
        <input
          type="text"
          value={pokemonName}
          onChange={(e) => setPokemonName(e.target.value)}
          placeholder="Enter Pokémon name"
          className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => fetchPokemon(pokemonName)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
        >
          Search
        </button>
      </div>

      {pokemon && (
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold capitalize mb-4">{pokemon.name}</h2>
          <img
            src={pokemon.sprites}
            alt={pokemon.name}
            className="mx-auto mb-4 h-40 object-contain"
          />
          <p className="mb-2"><strong>Types:</strong> {pokemon.types.join(', ')}</p>
          <div className="mb-2">
            <p className="font-semibold">Stats:</p>
            <ul className="list-disc list-inside">
              {pokemon.stats.map((stat, index) => (
                <li key={index}>{stat}</li>
              ))}
            </ul>
          </div>
          <p><strong>Abilities:</strong> {pokemon.abilities.join(', ')}</p>
        </div>
      )}
    </div>
);
}

export default App;