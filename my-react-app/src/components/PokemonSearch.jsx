import { useState, useEffect } from 'react';
import Autocomplete from './Autocomplete';
import { useAuth } from '../context/AuthContext';

const TYPE_COLORS = {
  normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
  grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
  ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
  rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
  steel: '#B7B7CE', fairy: '#D685AD',
};

function StatBar({ label, value }) {
  const max = 255;
  const percent = Math.min((value / max) * 100, 100);
  const color = percent > 70 ? '#4ade80' : percent > 40 ? '#facc15' : '#f87171';
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-16 text-right text-gray-500 dark:text-gray-400 capitalize text-xs font-medium">{label}</span>
      <span className="w-8 text-right font-bold text-gray-900 dark:text-white">{value}</span>
      <div className="flex-1 h-2.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="stat-bar-fill h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

function TypeBadge({ type }) {
  const bg = TYPE_COLORS[type.toLowerCase()] || '#777';
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-md" style={{ backgroundColor: bg }}>
      {type}
    </span>
  );
}

function PokeballSpinner() {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="pokeball-spin w-12 h-12 rounded-full border-4 border-gray-300 dark:border-white border-t-red-500 border-r-red-500" />
      <p className="text-gray-500 dark:text-gray-400 text-sm">Searching...</p>
    </div>
  );
}

function parseStat(statStr) {
  const match = statStr.match(/^(.+?):\s*(\d+)$/);
  if (match) return { name: match[1], value: parseInt(match[2], 10) };
  return { name: statStr, value: 0 };
}

export default function PokemonSearch() {
  const { token } = useAuth();
  const [pokemon, setPokemon] = useState(null);
  const [pokemonName, setPokemonName] = useState('pikachu');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPokemon = async (name) => {
    const trimmed = (name || '').trim().toLowerCase();
    if (!trimmed) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pokemon/${trimmed}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 429) {
        const data = await response.json();
        throw new Error(data.error || 'Guest limit reached. Register for unlimited access.');
      }
      if (!response.ok) throw new Error('Pokémon not found');
      const data = await response.json();
      setPokemon(data);
    } catch (err) {
      setPokemon(null);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon(pokemonName);
  }, []);

  const handleSelect = (name) => {
    setPokemonName(name);
    fetchPokemon(name);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') fetchPokemon(pokemonName);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Search */}
      <div className="flex gap-3 mb-10 w-full max-w-md">
        <Autocomplete
          value={pokemonName}
          onChange={setPokemonName}
          onSelect={handleSelect}
          placeholder="e.g. charizard"
          className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent backdrop-blur-sm transition-all"
        />
        <button
          onClick={() => fetchPokemon(pokemonName)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95"
        >
          Search
        </button>
      </div>

      {loading && <PokeballSpinner />}

      {error && !loading && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 text-red-400 text-center max-w-md">
          <p className="font-semibold">Oops!</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {pokemon && !loading && (
        <div className="card-enter bg-white/90 border border-gray-200 dark:bg-white/5 dark:border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 w-full max-w-md">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
              <img src={pokemon.sprites} alt={pokemon.name} className="sprite-bounce relative h-44 w-44 object-contain drop-shadow-lg" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center capitalize mb-3">{pokemon.name}</h2>
          <div className="flex justify-center gap-2 mb-5">
            {pokemon.types.map((type) => <TypeBadge key={type} type={type} />)}
          </div>
          <div className="space-y-2 mb-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Base Stats</h3>
            {pokemon.stats.map((stat, i) => {
              const { name, value } = parseStat(stat);
              return <StatBar key={i} label={name} value={value} />;
            })}
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability) => (
                <span key={ability} className="px-3 py-1 bg-gray-100 dark:bg-white/10 rounded-lg text-sm text-gray-700 dark:text-gray-300 capitalize">{ability}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
