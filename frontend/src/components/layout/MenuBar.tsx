import { Link } from "react-router-dom";
import libreForumLogo from "../../assets/img/LibreForum-logo.png";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../features/auth/useAuth";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../ui/Avatar";

export default function MenuBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [search, setSearch] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpened) return;

    function handlePointerDown(event: PointerEvent) {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpened(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [userMenuOpened]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search)}`);
  }

  const avatarUrl = user?.avatar;
  const avatarName = user && (user.displayName || user.username);

  return (
    <header className="border-b border-zinc-400 bg-zinc-300 dark:border-zinc-800 dark:bg-zinc-900">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
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
            <Link to="/" className="hover:text-zinc-500 hover:dark:text-zinc-400 hidden lg:block">Accueil</Link>
            <Link to="/new-topic" className="text-sm hover:text-zinc-500 hover:dark:text-zinc-400">Nouveau sujet</Link>
          </nav>
        </div>

        <div className="flex items-center">
          <form onSubmit={handleSearch} className="flex w-full md:w-fit">
            <input
              className="flex-1 rounded-tl-xl rounded-bl-xl dark:bg-zinc-800 px-4 py-2 text-sm outline-none border dark:border-gray-500"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="rounded-tr-xl rounded-br-xl dark:bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-400 border dark:border-gray-500 hover:dark:bg-zinc-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-5 h-5 text-gray-800 dark:text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
              </svg>
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <div ref={userMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpened((prev) => !prev)}
                className="flex flex-col gap-1 items-center justify-center  hover:text-zinc-500 hover:dark:text-zinc-400"
              >
                <Avatar size="sm" src={avatarUrl} name={avatarName} />
                <div className="text-nowrap text-sm">
                  {user.displayName || user.username}
                </div>
              </button>
              {userMenuOpened && (
                <div
                  className="absolute bg-zinc-300 dark:bg-zinc-950 dark:border-zinc-700 p-3 border-2 border-zinc-400 rounded-xl flex flex-col gap-3"
                >
                  <Link to={`/profile/${user.id}`}
                    className="flex flex-col gap-1 items-center justify-center  hover:text-zinc-500 hover:dark:text-zinc-400"
                    onClick={() => setUserMenuOpened(false)}
                  >
                    Mon profile
                  </Link>
                  <button
                    onClick={() => { setUserMenuOpened(false); logout() }}
                    className="rounded px-3 py-2 text-sm text-gray-900 bg-zinc-400 hover:bg-zinc-400/50 dark:text-gray-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-500 dark:border-zinc-700 transition-all cursor-pointer"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-zinc-500 hover:dark:text-zinc-400">Connexion</Link>
              <Link to="/register" className="hover:text-zinc-500 hover:dark:text-zinc-400 hidden lg:block">Inscription</Link>
            </>
          )}

          <ThemeToggle />
        </div>

      </nav>
    </header>
  );
}
