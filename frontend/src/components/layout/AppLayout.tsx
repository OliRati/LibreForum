import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";
import { useState } from "react";

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold">
              LibreForum
            </Link>

            <nav className="flex items-center gap-4 text-sm">
              <Link to="/" className="hover:text-zinc-300">Accueil</Link>
              <Link to="/new-topic" className="hover:text-zinc-300">Nouveau sujet</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                className="rounded-xl bg-zinc-800 px-4 py-2 text-sm outline-none"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-xl bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700"
              >
                Rechercher
              </button>
            </form>

            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={`/profile/${user.id}`}
                  className="text-sm text-zinc-400 hover:text-zinc-200"
                >
                  {user.displayName || user.username}
                </Link>
                <button
                  onClick={logout}
                  className="rounded bg-zinc-800 px-3 py-2 text-sm hover:bg-zinc-700"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-sm">
                <Link to="/login" className="hover:text-zinc-300">Connexion</Link>
                <Link to="/register" className="hover:text-zinc-300">Inscription</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}