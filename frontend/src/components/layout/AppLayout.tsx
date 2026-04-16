import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/useAuth";
import { useState } from "react";
import libreForumLogo from "../../assets/img/LibreForum-logo.png";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold">
              <div>
                <div className="w-16 mx-auto">
                  <img src={libreForumLogo} alt="LibreForum" />
                </div>
                <div className="text-center mx-auto font-mono text-base">
                  <span className="text-blue-500">Libre</span>
                  <span className="text-green-600">Forum</span>
                </div>
              </div>
            </Link>

            <nav className="flex items-center gap-4 text-sm">
              <Link to="/" className="hover:text-zinc-300">Accueil</Link>
              <Link to="/new-topic" className="hover:text-zinc-300">Nouveau sujet</Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <form onSubmit={handleSearch} className="flex">
              <input
                className="rounded-tl-xl rounded-bl-xl bg-zinc-800 px-4 py-2 text-sm outline-none border border-gray-500"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-tr-xl rounded-br-xl bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700 border border-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke-width="1.5" 
                  stroke="currentColor" 
                  className="w-5 h-5 text-gray-400">
                  <path stroke-linecap="round" stroke-linejoin="round" 
                        d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                </svg>
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

      <main className="flex-1 mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="py-8 border-b border-zinc-800 bg-zinc-900">
        <p>LibreForum est un projet mené dans le cadre d'un travail d'étudiant en Developpement Web et Web mobile.</p>
      </footer>
    </div>
  );
}