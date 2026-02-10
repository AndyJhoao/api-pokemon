import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Autocomplete from '../components/Autocomplete';
import { apiUrl } from '../config/api';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [favoritePokemon, setFavoritePokemon] = useState(user?.favoritePokemon || '');
  const [profilePokemon, setProfilePokemon] = useState(user?.profilePokemon || '');
  const [profilePokemonInput, setProfilePokemonInput] = useState(user?.profilePokemon || '');
  const [spritePreview, setSpritePreview] = useState(null);
  const [spriteError, setSpriteError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400">Please login to view your profile.</p>
      </div>
    );
  }

  const loadSprite = async (name) => {
    if (!name) {
      setSpritePreview(null);
      setSpriteError(false);
      return;
    }
    setSpriteError(false);
    try {
      const res = await fetch(apiUrl(`/api/pokemon/${name.toLowerCase()}`));
      if (res.ok) {
        const data = await res.json();
        const sprite = data.sprites || null;
        setSpritePreview(sprite);
        setSpriteError(!sprite);
      } else {
        setSpritePreview(null);
        setSpriteError(true);
      }
    } catch {
      setSpritePreview(null);
      setSpriteError(true);
    }
  };

  const handleSelectProfilePokemon = (name) => {
    setProfilePokemonInput(name);
    setProfilePokemon(name);
    loadSprite(name);
  };

  const avatarSrc = spritePreview || user.profileSprite || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError('');
    try {
      await updateProfile({ displayName, favoritePokemon, profilePokemon });
      setSaved(true);
    } catch {
      setError('Failed to update profile');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white/90 border border-gray-200 dark:bg-white/5 dark:border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <div className="flex flex-col items-center mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 dark:bg-white/10 dark:border-white/20 flex items-center justify-center overflow-hidden mb-2">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Profile Pokemon"
                className="w-20 h-20 object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trainer Profile</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {saved && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg px-4 py-2 text-green-400 text-sm text-center mb-4">
            Profile updated!
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2 text-red-400 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest mb-1 block">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest mb-1 block">Favorite Pokemon</label>
            <Autocomplete
              value={favoritePokemon}
              onChange={setFavoritePokemon}
              onSelect={setFavoritePokemon}
              placeholder="e.g. pikachu"
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-600 dark:text-gray-500 uppercase tracking-widest mb-1 block">Profile Picture Pokemon</label>
            <Autocomplete
              value={profilePokemonInput}
              onChange={setProfilePokemonInput}
              onSelect={handleSelectProfilePokemon}
              placeholder="e.g. charizard"
              className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {spriteError && (
              <p className="text-red-400 text-xs mt-1">Pokemon not found</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
