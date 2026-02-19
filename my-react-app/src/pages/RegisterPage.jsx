import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EyeToggle from '../components/EyeToggle';
import ButtonSpinner from '../components/ButtonSpinner';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, displayName);
      navigate('/');
    } catch {
      setError('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white border-2 border-blue-200 dark:bg-white/5 dark:border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">Create Account</h2>

        {error && (
          <div className="bg-red-100 border-2 border-red-300 dark:bg-red-500/10 dark:border-red-500/30 rounded-lg px-4 py-2 text-red-700 dark:text-red-400 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Trainer Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-blue-50 border-2 border-blue-200 text-gray-900 placeholder-gray-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:border-transparent transition-all"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-blue-50 border-2 border-blue-200 text-gray-900 placeholder-gray-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:border-transparent transition-all"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 pr-12 rounded-xl bg-blue-50 border-2 border-blue-200 text-gray-900 placeholder-gray-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:border-transparent transition-all"
            />
            <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white font-semibold rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <><ButtonSpinner /> Creating account...</> : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
