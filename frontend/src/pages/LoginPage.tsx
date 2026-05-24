import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth'; 

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);;
      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Identifiants invalides ou erreur API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Connexion</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded bg-zinc-800 px-4 py-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <input
          className="w-full rounded bg-zinc-800 px-4 py-3"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {error && (
          <div className="text-red-600 text-sm mb-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded transition border-emerald-700 bg-emerald-500 hover:bg-emerald-600 text-white py-2 mt-4"
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>

        <span className="text-sm text-zinc-300">Pas encore de compte, <Link to="/register" className="text-blue-400 hover:underline">S'inscrire</Link></span>

      </form>
    </div>
  );
}