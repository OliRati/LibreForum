import { Outlet, Link } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";
import SearchBar from "../ui/SearchBar";

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <Link to="/" className="text-xl font-bold">
                LibreForum
              </Link>

              <nav className="flex items-center gap-4 text-sm">
                <Link to="/">Accueil</Link>
                <Link to="/new-topic">Nouveau sujet</Link>

                {user ? (
                  <>
                    <Link to={`/profile/${user.id}`}>
                      {user.displayName || user.username}
                    </Link>
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

            <div className="w-full lg:max-w-md">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}