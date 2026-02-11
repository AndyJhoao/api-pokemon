import { createContext, useContext, useState, useCallback } from 'react';
import { apiUrl } from '../config/api';

const PokemonContext = createContext();

// Cache expiration time (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

export function PokemonProvider({ children }) {
  // Current searched Pokemon (persists across navigation)
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [currentPokemonName, setCurrentPokemonName] = useState('pikachu');

  // Cache for Pokemon data { name: { data, timestamp } }
  const [cache, setCache] = useState({});

  const getCachedPokemon = useCallback((name) => {
    const cached = cache[name.toLowerCase()];
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    return null;
  }, [cache]);

  const setCachedPokemon = useCallback((name, data) => {
    setCache(prev => ({
      ...prev,
      [name.toLowerCase()]: {
        data,
        timestamp: Date.now(),
      },
    }));
  }, []);

  const fetchPokemon = useCallback(async (name, token) => {
    const trimmed = (name || '').trim().toLowerCase();
    if (!trimmed) return { error: 'Please enter a Pokemon name' };

    // Check cache first
    const cached = getCachedPokemon(trimmed);
    if (cached) {
      setCurrentPokemon(cached);
      setCurrentPokemonName(trimmed);
      return { data: cached };
    }

    // Fetch from API
    try {
      const response = await fetch(apiUrl(`/api/pokemon/${trimmed}`), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.status === 429) {
        const data = await response.json();
        return { error: data.error || 'Guest limit reached. Register for unlimited access.' };
      }

      if (!response.ok) {
        return { error: 'Pokemon not found' };
      }

      const data = await response.json();

      // Store in cache
      setCachedPokemon(trimmed, data);

      // Update current Pokemon
      setCurrentPokemon(data);
      setCurrentPokemonName(trimmed);

      return { data };
    } catch (err) {
      return { error: err.message || 'Network error' };
    }
  }, [getCachedPokemon, setCachedPokemon]);

  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  return (
    <PokemonContext.Provider value={{
      currentPokemon,
      currentPokemonName,
      setCurrentPokemonName,
      fetchPokemon,
      getCachedPokemon,
      clearCache,
    }}>
      {children}
    </PokemonContext.Provider>
  );
}

export const usePokemon = () => useContext(PokemonContext);
