import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PokemonSearch from './components/PokemonSearch';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './context/AuthContext';
import './App.css';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="pokeball-spin w-12 h-12 rounded-full border-4 border-gray-300 dark:border-white border-t-red-500 border-r-red-500" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">
          Pokédex
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Search any Pokémon by name</p>
      </div>
      <PokemonSearch />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}

export default App;
