import { useCallback, useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { register } from '../../api/auth';
import { deleteUser, updateUser, type UpdateUserPayload } from '../../api/users';
import EmptyState from '../../components/ui/EmptyState';
import Loader from '../../components/ui/Loader';
import { useAuthStore } from '../../features/auth/authStore';
import { getUsers } from '../../services/users';
import type { User } from '../../types/user';

type UserForm = {
  id: number | null;
  email: string;
  username: string;
  displayName: string;
  bio: string;
  forumRank: string;
  password: string;
  currentPassword: string;
};

const emptyForm: UserForm = {
  id: null,
  email: '',
  username: '',
  displayName: '',
  bio: '',
  forumRank: 'Membre',
  password: '',
  currentPassword: '',
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ error?: string; message?: string }>(error)) {
    return error.response?.data?.error
      ?? error.response?.data?.message
      ?? 'Une erreur est survenue. Veuillez réessayer.';
  }

  return 'Une erreur est survenue. Veuillez réessayer.';
}

export default function AdminUsersPage() {
  const currentUserId = useAuthStore((state) => state.user?.id);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<UserForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setUsers(await getUsers());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function startEditing(user: User) {
    setError('');
    setSuccess('');
    setForm({
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName ?? '',
      bio: user.bio ?? '',
      forumRank: user.forumRank ?? '',
      password: '',
      currentPassword: '',
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (form.id === null) {
        await register({
          email: form.email.trim(),
          username: form.username.trim(),
          password: form.password,
          ...(form.displayName.trim() ? { displayName: form.displayName.trim() } : {}),
          bio: form.bio.trim() || null,
        });
        setSuccess('Le compte utilisateur a été créé.');
      } else {
        const payload: UpdateUserPayload = {
          currentPassword: form.currentPassword,
          displayName: form.displayName.trim() || null,
          bio: form.bio.trim() || null,
          forumRank: form.forumRank.trim() || null,
          ...(form.password ? { password: form.password } : {}),
        };
        await updateUser(form.id, payload);
        setSuccess('Le profil utilisateur a été modifié.');
      }

      setForm(null);
      await loadUsers();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(user: User) {
    if (user.id === currentUserId || user.state === 'deleted') return;
    if (!window.confirm(`Désactiver le compte de ${user.displayName || user.username} ?`)) return;

    setDeletingId(user.id);
    setError('');
    setSuccess('');
    try {
      await deleteUser(user.id);
      setUsers((current) => current.map((entry) => (
        entry.id === user.id ? { ...entry, state: 'deleted' } : entry
      )));
      setSuccess(`Le compte de ${user.displayName || user.username} a été désactivé.`);
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-red-200 bg-red-100 p-3 dark:border-red-800 dark:bg-red-950">
        <Link to="/admin/dashboard" className="hover:text-zinc-600 dark:hover:text-zinc-300">
          Administration du système
        </Link>
        <span className="mx-2 text-zinc-500">/</span>
        <span className="text-zinc-700 dark:text-zinc-300">Gestion des utilisateurs</span>
      </section>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-400">
            Les comptes créés ont le rôle membre. La suppression désactive le compte sans effacer ses contenus.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError('');
            setSuccess('');
            setForm(emptyForm);
          }}
          className="rounded-xl border border-red-300 bg-red-100 px-4 py-2 text-sm font-semibold text-red-900 transition hover:bg-red-200 dark:border-red-800 dark:bg-red-950 dark:text-red-200 dark:hover:bg-red-900"
        >
          Créer un utilisateur
        </button>
      </header>

      {error && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between dark:text-red-300">
          {error}
          <button
            type="button"
            onClick={() => void loadUsers()}
            className="w-fit rounded-lg border border-red-500/40 px-3 py-1.5 font-medium transition hover:bg-red-500/10"
          >
            Réessayer
          </button>
        </div>
      )}
      {success && (
        <div role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
          {success}
        </div>
      )}

      {form && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-zinc-500 bg-zinc-300 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <h2 className="text-xl font-semibold">
            {form.id === null ? 'Nouvel utilisateur' : 'Modifier le profil'}
          </h2>

          {form.id === null ? (
            <>
              <label className="block space-y-1 text-sm font-medium">
                <span>Adresse e-mail <span className="text-red-600">*</span></span>
                <input
                  type="email"
                  required
                  maxLength={180}
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  className="w-full rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>
              <label className="block space-y-1 text-sm font-medium">
                <span>Nom d’utilisateur <span className="text-red-600">*</span></span>
                <input
                  required
                  maxLength={50}
                  value={form.username}
                  onChange={(event) => setForm({ ...form, username: event.target.value })}
                  className="w-full rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>
            </>
          ) : (
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p><span className="font-medium">E-mail :</span> {form.email}</p>
              <p><span className="font-medium">Nom d’utilisateur :</span> {form.username}</p>
            </div>
          )}

          <label className="block space-y-1 text-sm font-medium">
            <span>Nom affiché</span>
            <input
              maxLength={100}
              value={form.displayName}
              onChange={(event) => setForm({ ...form, displayName: event.target.value })}
              className="w-full rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>

          <label className="block space-y-1 text-sm font-medium">
            <span>Biographie</span>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              className="w-full resize-y rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>

          {form.id === null ? (
            <label className="block space-y-1 text-sm font-medium">
              <span>Mot de passe <span className="text-red-600">*</span></span>
              <input
                type="password"
                required
                minLength={12}
                value={form.password}
                onChange={(event) => setForm({ ...form, password: event.target.value })}
                className="w-full rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
              />
              <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                Au moins 12 caractères, avec majuscule, minuscule, chiffre et caractère spécial.
              </span>
            </label>
          ) : (
            <>
              <label className="block space-y-1 text-sm font-medium">
                <span>Rang sur le forum</span>
                <input
                  maxLength={50}
                  value={form.forumRank}
                  onChange={(event) => setForm({ ...form, forumRank: event.target.value })}
                  className="w-full rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </label>
              <label className="block space-y-1 text-sm font-medium">
                <span>Nouveau mot de passe (facultatif)</span>
                <input
                  type="password"
                  minLength={12}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                  className="w-full rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                  Laissez vide pour conserver le mot de passe actuel.
                </span>
              </label>
              <label className="block space-y-1 text-sm font-medium">
                <span>Votre mot de passe administrateur <span className="text-red-600">*</span></span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={form.currentPassword}
                  onChange={(event) => setForm({ ...form, currentPassword: event.target.value })}
                  className="w-full rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                />
                <span className="block text-xs text-zinc-600 dark:text-zinc-400">
                  L’API exige ce mot de passe pour autoriser toute modification.
                </span>
              </label>
            </>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Enregistrement...' : form.id === null ? 'Créer le compte' : 'Enregistrer'}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              disabled={saving}
              className="rounded-xl border border-zinc-500 px-4 py-2 text-sm font-medium transition hover:bg-zinc-400/50 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        error ? null : (
          <EmptyState title="Aucun utilisateur" description="Aucun compte à afficher." />
        )
      ) : (
        <div className="space-y-4">
          {users.map((user) => {
            const isDeleted = user.state === 'deleted';
            const isCurrentUser = user.id === currentUserId;

            return (
              <article
                key={user.id}
                className="rounded-2xl border border-zinc-500 bg-zinc-300 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-semibold">{user.displayName || user.username}</h2>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        isDeleted
                          ? 'bg-red-500/10 text-red-700 dark:text-red-300'
                          : 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                      }`}>
                        {isDeleted ? 'Désactivé' : user.state === 'banned' ? 'Banni' : 'Actif'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{user.email}</p>
                    <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                      @{user.username} · Rang : {user.forumRank || 'Aucun'}
                    </p>
                    <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-500">
                      Rôle(s) : {user.roles.join(', ')}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <Link
                      to={`/profile/${user.id}`}
                      className="rounded-lg border border-zinc-500 px-3 py-2 text-sm transition hover:bg-zinc-400/50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                    >
                      Voir
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEditing(user)}
                      disabled={isDeleted}
                      className="rounded-lg border border-blue-500/40 px-3 py-2 text-sm text-blue-800 transition hover:bg-blue-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-300"
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(user)}
                      disabled={isDeleted || isCurrentUser || deletingId === user.id}
                      title={isCurrentUser ? 'Vous ne pouvez pas désactiver votre propre compte.' : undefined}
                      className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-700 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-300"
                    >
                      {deletingId === user.id ? 'Désactivation...' : 'Désactiver'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
