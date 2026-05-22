import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!accepted) {
      setError("Vous devez accepter les CGU pour vous inscrire sur ce site");
      return;
    }

    try {
      await register({
        email,
        username,
        password,
        displayName,
      });

      navigate("/login");
    } catch {
      setError("Impossible de créer le compte.");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-100 p-6">
      <h1 className="mb-6 text-2xl font-bold">Inscription</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded bg-zinc-800 px-4 py-3"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full rounded bg-zinc-800 px-4 py-3"
          placeholder="Nom d’utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full rounded bg-zinc-800 px-4 py-3"
          placeholder="Nom affiché"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />

        <input
          className="w-full rounded bg-zinc-800 px-4 py-3"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-800"
            />
            <span className="text-sm text-zinc-300">J'accepte les <Link to="/cgu" className="text-blue-400 hover:underline">Conditions Générales d'Utilisation</Link></span>
          </label>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-500"
        >
          Créer un compte
        </button>
      </form>
    </div>
  );
}