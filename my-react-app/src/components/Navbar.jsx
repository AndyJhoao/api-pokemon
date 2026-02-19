import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <nav className="w-full px-6 py-3 flex items-center justify-between backdrop-blur-md border-b bg-white/90 border-blue-200 shadow-sm dark:bg-white/5 dark:border-white/10">
      <Link to="/" className="text-xl font-bold text-red-600 hover:text-red-700 dark:text-red-500 transition-colors">
        Pokédex
      </Link>

      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white transition-colors text-sm shadow-sm"
          title={dark ? 'Light mode' : 'Dark mode'}
        >
          {dark ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <Link
              to="/profile"
              className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition-colors font-medium"
            >
              {user.profileSprite ? (
                <img src={user.profileSprite} alt="" className="w-7 h-7 rounded-full bg-blue-100 border-2 border-blue-200 dark:bg-white/10 dark:border-white/20" />
              ) : (
                <span className="w-7 h-7 rounded-full bg-blue-100 border-2 border-blue-200 dark:bg-white/10 dark:border-white/20 flex items-center justify-center text-xs text-blue-900 dark:text-white font-bold">
                  {user.displayName?.charAt(0)?.toUpperCase()}
                </span>
              )}
              {user.displayName}
            </Link>
            <button
              onClick={logout}
              className="text-sm px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 dark:bg-red-600/20 dark:text-red-400 dark:hover:bg-red-600/30 dark:border-transparent transition-colors font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-sm px-3 py-1.5 rounded-lg bg-blue-100 text-blue-900 hover:bg-blue-200 border border-blue-300 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/20 dark:border-transparent transition-colors font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 shadow-sm transition-colors font-medium"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
