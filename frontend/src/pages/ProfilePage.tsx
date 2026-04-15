import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, type UserProfile } from "../api/users";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { formatDate } from "../lib/formatDate";
import { isOnline } from '../utils/auth.js';

export default function ProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      setLoading(true);
      try {
        const data = await getUser(id);
        setUser(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <Loader />;
  if (!user) return <EmptyState title="Utilisateur introuvable" />;

  console.dir(user);
  
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 text-2xl font-bold text-zinc-300">
            {(user.displayName || user.username).charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {user.displayName || user.username}
            </h1>
            <p className="mt-1 text-zinc-400">@{user.username}</p>

            {user.forumRank && (
              <p className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                {user.forumRank}
              </p>
            )}
          </div>
        </div>

        {user.bio && (
          <div className="mt-6 rounded-xl bg-zinc-800/60 p-4 text-zinc-300">
            {user.bio}
          </div>
        )}

        {user.createdAt && (
          <p className="mt-6 text-sm text-zinc-500">
            Membre depuis {formatDate(user.createdAt)}
          </p>
        )}

        {isOnline(user.lastSeenAt) ? (
          <span className="text-green-500">●</span>
        ) : (
          <span className="text-gray-400">●</span>
        )}
      </section>
    </div>
  );
}