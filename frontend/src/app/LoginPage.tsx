import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@libreforum.local");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Identifiants invalides");
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="mb-6 text-2xl font-bold">Connexion</h1>

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
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="w-full rounded bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-500"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}