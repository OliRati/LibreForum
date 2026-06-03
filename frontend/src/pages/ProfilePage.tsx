import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { getUser, updateUser, type UserProfile } from "../api/users";
import { useAuthStore } from "../features/auth/authStore";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import { formatDate } from "../lib/formatDate";
import { isOnline } from '../utils/auth.js';
import PasswordInputGroup, { isPasswordValid, passwordsMatch } from "../components/ui/PasswordInputGroup";

export default function ProfilePage() {
  const { id } = useParams();
  const currentUser = useAuthStore((state) => state.user);
  const setCurrentUser = useAuthStore((state) => state.setUser);
  const ownProfile = currentUser?.id === Number(id);

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const newPasswordIsValid = newPassword === "" || isPasswordValid(newPassword);
  const newPasswordMatch = !newPassword || passwordsMatch(newPassword, confirmPassword);

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

  useEffect(() => {
    if (!ownProfile || !user) return;

    setDisplayName(user.displayName ?? "");
    setBio(user.bio ?? "");
  }, [ownProfile, user]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setAvatarFile(file);

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
      setAvatarPreview(null);
    }

    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!newPassword && confirmPassword) {
      setStatus({ type: "error", message: "Veuillez renseigner le nouveau mot de passe." });
      return;
    }

    if (newPassword && !newPasswordIsValid) {
      setStatus({ type: "error", message: "Le mot de passe doit contenir : 12 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial." });
      return;
    }

    if (newPassword && !newPasswordMatch) {
      setStatus({ type: "error", message: "La confirmation du mot de passe ne correspond pas." });
      return;
    }

    if (!id || !ownProfile) {
      return;
    }

    try {
      setSaving(true);
      const payload: Parameters<typeof updateUser>[1] = {
        displayName,
        bio,
        avatarFile,
      };

      if (newPassword) {
        payload.password = newPassword;
      }

      const updated = await updateUser(id, payload);

      setUser(updated);
      const authUser = {
        id: updated.id,
        email: updated.email ?? "",
        username: updated.username,
        roles: updated.roles ?? [],
      } as {
        id: number;
        email: string;
        username: string;
        roles: string[];
        displayName?: string;
        bio?: string;
        avatar?: string;
        forumRank?: string;
      };

      if (updated.displayName != null) {
        authUser.displayName = updated.displayName;
      }
      if (updated.bio != null) {
        authUser.bio = updated.bio;
      }
      if (updated.avatar != null) {
        authUser.avatar = updated.avatar;
      }
      if (updated.forumRank != null) {
        authUser.forumRank = updated.forumRank;
      }

      setCurrentUser(authUser);
      setStatus({ type: "success", message: "Profil mis à jour." });
      setNewPassword("");
      setConfirmPassword("");
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Impossible de mettre à jour le profil." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;
  if (!user) return <EmptyState title="Utilisateur introuvable" />;

  const avatarUrl = avatarPreview ?? user.avatar;
  const initials = (user.displayName || user.username).charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-start gap-5">
          <div className="relative h-20 w-20 overflow-hidden rounded-full bg-zinc-800 text-2xl font-bold text-zinc-300">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={`${user.displayName || user.username} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl">
                {initials}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold text-zinc-100">
              {user.displayName || user.username}
            </h1>
            <p className="mt-1 text-zinc-400">@{user.username}</p>

            {user.forumRank && (
              <p className="mt-3 inline-flex rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
                {user.forumRank}
              </p>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                <p className="text-3xl font-semibold text-zinc-100 text-center">
                  {user.postsCount ?? 0}
                </p>
                <p className="mt-1 text-sm text-zinc-500 text-center">Posts écrits</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                <p className="text-3xl font-semibold text-zinc-100 text-center">
                  {user.topicsCreatedCount ?? 0}
                </p>
                <p className="mt-1 text-sm text-zinc-500 text-center">Sujets créés</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
                <p className="text-3xl font-semibold text-zinc-100 text-center">
                  {user.topicsParticipatedCount ?? 0}
                </p>
                <p className="mt-1 text-sm text-zinc-500 text-center">Sujets participés</p>
              </div>
            </div>
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

        <div className="mt-3 flex items-center gap-2 text-sm text-zinc-400">
          <span className={isOnline(user.lastSeenAt ?? "") ? "text-emerald-400" : "text-zinc-500"}>
            ●
          </span>
          <span>{isOnline(user.lastSeenAt ?? "") ? "En ligne" : "Hors ligne"}</span>
        </div>
      </section>

      {ownProfile && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-100">Modifier mon profil</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Changez votre nom affiché, votre bio, votre mot de passe ou votre avatar.
              </p>
            </div>
          </div>

          {status && (
            <div
              className={`rounded-xl border px-4 py-3 text-sm mb-6 ${status.type === 'success'
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-red-500/30 bg-red-500/10 text-red-300'}`}
            >
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm text-zinc-400">
                Nom affiché
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className="mt-2 w-full rounded bg-zinc-800 px-4 py-3 text-zinc-100 outline-none"
                  placeholder="Nom affiché"
                />
              </label>

              <label className="block text-sm text-zinc-400">
                Bio
                <input
                  type="text"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="mt-2 w-full rounded bg-zinc-800 px-4 py-3 text-zinc-100 outline-none"
                  placeholder="Quelques mots sur vous"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <PasswordInputGroup
                password={newPassword}
                confirmPassword={confirmPassword}
                onPasswordChange={setNewPassword}
                onConfirmPasswordChange={setConfirmPassword}
                passwordLabel="Nouveau mot de passe"
                confirmLabel="Confirmation du mot de passe"
                passwordPlaceholder="Laisser vide pour ne pas changer"
                confirmPlaceholder="Confirmer le nouveau mot de passe"
              />
            </div>

            <div className="space-y-2">
              <p className="text-2xl text-zinc-400">Avatar</p>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-zinc-800 text-3xl text-zinc-300">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Aperçu de l'avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      {initials}
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="flex-1 text-sm text-zinc-400 file:mr-4 file:rounded-xl file:border-0 file:bg-emerald-600 hover:file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white file:cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-500 disabled:opacity-60 cursor-pointer"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}