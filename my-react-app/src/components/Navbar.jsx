import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between backdrop-blur-md border-b bg-white/80 border-gray-200 dark:bg-white/5 dark:border-white/10">
      <Link to="/" className="text-xl font-bold text-red-600 dark:text-red-500">
        Pokédex
      </Link>

      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-white/10 dark:hover:bg-white/20 transition-colors text-sm"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {user.profileSprite ? (
                <img src={user.profileSprite} alt="" className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/10" />
              ) : (
                <span className="w-7 h-7 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center text-xs">
                  {user.displayName?.charAt(0)?.toUpperCase()}
                </span>
              )}
              {user.displayName}
            </Link>
            <button
              onClick={logout}
              className="text-sm px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
