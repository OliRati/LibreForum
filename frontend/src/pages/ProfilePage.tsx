import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUser, type UserProfile } from "../api/users";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";

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

  if (!user) {
    return (
      <EmptyState
        title="Utilisateur introuvable"
        description="Ce profil n’existe pas ou n’est plus disponible."
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
      <div className="flex items-start gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-zinc-800 text-3xl font-bold text-zinc-300">
          {(user.displayName || user.username)?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-zinc-100">
            {user.displayName || user.username}
          </h1>

          <p className="mt-1 text-sm text-zinc-500">@{user.username}</p>

          {user.forumRank && (
            <div className="mt-3 inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">
              {user.forumRank}
            </div>
          )}

          {user.bio && (
            <p className="mt-5 whitespace-pre-wrap leading-7 text-zinc-300">
              {user.bio}
            </p>
          )}

          {user.createdAt && (
            <p className="mt-5 text-sm text-zinc-500">
              Membre depuis le{" "}
              {new Date(user.createdAt).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}