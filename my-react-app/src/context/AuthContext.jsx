import { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../config/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      fetchProfile();
    }
  }, []);

  const fetchSprite = async (pokemonName) => {
    if (!pokemonName) return null;
    try {
      const res = await fetch(apiUrl(`/api/pokemon/${pokemonName.toLowerCase()}`));
      if (res.ok) {
        const data = await res.json();
        return data.sprites || null;
      }
    } catch {}
    return null;
  };

  const fetchProfile = async (authToken) => {
    const t = authToken || token;
    try {
      const res = await fetch(apiUrl('/api/user/profile'), {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profilePokemon) {
          data.profileSprite = await fetchSprite(data.profilePokemon);
        }
        setUser(data);
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

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
    const res = await fetch(apiUrl('/api/user/profile'), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.profilePokemon) {
        data.profileSprite = await fetchSprite(data.profilePokemon);
      }
      setUser(data);
      return data;
    }
    throw new Error('Failed to update profile');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, guestLogin, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
