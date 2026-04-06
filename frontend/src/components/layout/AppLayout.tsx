import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold">
            LibreForum
          </Link>

          <nav className="flex items-center gap-4">
            <Link to="/">Accueil</Link>
            <Link to="/new-topic">Nouveau sujet</Link>

            {user ? (
              <>
                <span className="text-sm text-zinc-400">
                  {user.displayName || user.username}
                </span>
                <button
                  onClick={logout}
                  className="rounded bg-zinc-800 px-3 py-1 hover:bg-zinc-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Connexion</Link>
                <Link to="/register">Inscription</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}