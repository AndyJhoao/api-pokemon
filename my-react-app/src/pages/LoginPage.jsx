import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EyeToggle from '../components/EyeToggle';
import ButtonSpinner from '../components/ButtonSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    try {
      await guestLogin();
      navigate('/');
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="bg-white border-2 border-blue-200 dark:bg-white/5 dark:border-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6">Welcome Back</h2>

        {error && (
          <div className="bg-red-100 border-2 border-red-300 dark:bg-red-500/10 dark:border-red-500/30 rounded-lg px-4 py-2 text-red-700 dark:text-red-400 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-3 pr-12 rounded-xl bg-blue-50 border-2 border-blue-200 text-gray-900 placeholder-gray-500 dark:bg-white/10 dark:border-white/20 dark:text-white dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:focus:border-transparent transition-all"
            />
            <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white font-semibold rounded-xl shadow-lg shadow-red-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <><ButtonSpinner /> Logging in...</> : 'Login'}
          </button>
        </form>

        <div className="mt-4 flex flex-col gap-3">
          <button
            onClick={handleGuest}
            disabled={guestLoading}
            className="w-full py-3 bg-blue-100 hover:bg-blue-200 border border-blue-300 dark:bg-white/10 dark:hover:bg-white/20 dark:border-transparent disabled:opacity-70 text-blue-900 dark:text-gray-300 font-medium rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {guestLoading ? <><ButtonSpinner /> Entering...</> : 'Continue as Guest'}
          </button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
