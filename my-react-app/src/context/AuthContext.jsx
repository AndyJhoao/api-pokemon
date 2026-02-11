import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiUrl } from '../config/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  const fetchSprite = useCallback(async (pokemonName, authToken) => {
    if (!pokemonName) return null;
    try {
      const res = await fetch(apiUrl(`/api/pokemon/${pokemonName.toLowerCase()}`), {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        return data.sprites || null;
      }
    } catch {}
    return null;
  }, []);

  const fetchProfile = useCallback(async (authToken) => {
    if (!authToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(apiUrl('/api/user/profile'), {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profilePokemon) {
          data.profileSprite = await fetchSprite(data.profilePokemon, authToken);
        }
        setUser(data);
      } else if (res.status === 401 || res.status === 403) {
        // Only logout on auth errors, not network errors
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
      // For other errors (network, 500, etc.), keep the token and try again later
    } catch {
      // Network error - don't logout, just leave user as null
      // Token is preserved in localStorage for retry on next refresh
    } finally {
      setLoading(false);
    }
  }, [fetchSprite]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      fetchProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, [fetchProfile]);

  const parseError = async (res, fallback) => {
    try {
      const data = await res.json();
      return data.error || fallback;
    } catch {
      return fallback;
    }
  };

  const login = async (email, password) => {
    const res = await fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const msg = await parseError(res, 'Login failed');
      throw new Error(msg);
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    await fetchProfile(data.token);
    return data;
  };

  const register = async (email, password, displayName) => {
    const res = await fetch(apiUrl('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, displayName }),
    });
    if (!res.ok) {
      const msg = await parseError(res, 'Registration failed');
      throw new Error(msg);
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    await fetchProfile(data.token);
    return data;
  };

  const guestLogin = async () => {
    const res = await fetch(apiUrl('/api/auth/guest'), { method: 'POST' });
    const data = await res.json();
    localStorage.setItem('token', data.token);
    setToken(data.token);
    await fetchProfile(data.token);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const currentToken = token || localStorage.getItem('token');
    const res = await fetch(apiUrl('/api/user/profile'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify(profileData),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profilePokemon) {
        data.profileSprite = await fetchSprite(data.profilePokemon, currentToken);
      }
      setUser(data);
      return data;
    }
    throw new Error('Failed to update profile');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, guestLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
