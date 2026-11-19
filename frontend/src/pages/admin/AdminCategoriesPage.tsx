import { useCallback, useEffect, useState, type FormEvent } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  type Category,
  type CategoryPayload,
} from '../../api/categories';
import EmptyState from '../../components/ui/EmptyState';
import Loader from '../../components/ui/Loader';

type CategoryForm = {
  id?: number;
  name: string;
  description: string;
  icon: string;
};

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? 'Une erreur est survenue. Veuillez réessayer.';
  }

  return 'Une erreur est survenue. Veuillez réessayer.';
}

const emptyForm: CategoryForm = { name: '', description: '', icon: '' };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setCategories(await getCategories());
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function startEditing(category: Category) {
    setError('');
    setSuccess('');
    setForm({
      id: category.id,
      name: category.name,
      description: category.description ?? '',
      icon: category.icon ?? '',
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form) return;

    const payload: CategoryPayload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      icon: form.icon.trim() || null,
    };

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (form.id === undefined) {
        await createCategory(payload);
        setSuccess('La catégorie a été créée.');
      } else {
        await updateCategory(form.id, payload);
        setSuccess('La catégorie a été modifiée.');
      }
      setForm(null);
      await loadCategories();
    } catch (saveError) {
      setError(getErrorMessage(saveError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category: Category) {
    if (!window.confirm(`Supprimer la catégorie « ${category.name} » ?`)) return;

    setDeletingId(category.id);
    setError('');
    setSuccess('');
    try {
      await deleteCategory(category.id);
      setCategories((current) => current.filter(({ id }) => id !== category.id));
      setSuccess(`La catégorie « ${category.name} » a été supprimée.`);
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
        <span className="text-zinc-700 dark:text-zinc-300">Gestion des catégories</span>
      </section>

      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des catégories</h1>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-400">
            Créez et modifiez les catégories du forum. Le slug est généré automatiquement à partir du nom.
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
          Créer une catégorie
        </button>
      </header>

      {error && (
        <div role="alert" className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between dark:text-red-300">
          {error}
          <button
            type="button"
            onClick={() => void loadCategories()}
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
            {form.id === undefined ? 'Nouvelle catégorie' : 'Modifier la catégorie'}
          </h2>

          <label className="block space-y-1 text-sm font-medium">
            <span>Nom <span className="text-red-600">*</span></span>
            <input
              required
              maxLength={150}
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="w-full rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>

          <label className="block space-y-1 text-sm font-medium">
            <span>Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full resize-y rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>

          <label className="block space-y-1 text-sm font-medium">
            <span>Icône (facultatif)</span>
            <input
              maxLength={255}
              value={form.icon}
              onChange={(event) => setForm({ ...form, icon: event.target.value })}
              className="w-full rounded-xl border border-zinc-400 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </label>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Enregistrement...' : form.id === undefined ? 'Créer' : 'Enregistrer'}
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
      ) : categories.length === 0 ? (
        error ? null : (
          <EmptyState
            title="Aucune catégorie"
            description="Créez une catégorie pour organiser les sujets du forum."
          />
        )
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-2xl border border-zinc-500 bg-zinc-300 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold">{category.name}</h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {category.description || 'Aucune description'}
                  </p>
                  <p className="mt-2 break-all text-xs text-zinc-500 dark:text-zinc-500">
                    Slug : {category.slug}
                    {category.icon && <span className="ml-3">Icône : {category.icon}</span>}
                  </p>
                  <p className="mt-3 text-sm text-zinc-700 dark:text-zinc-300">
                    {category.topicsCount ?? 0} sujet(s)
                    {' · '}{category.postsCount ?? 0} réponse(s)
                    {' · '}{category.participantsCount ?? 0} participant(s)
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <Link
                    to={`/category/${category.id}`}
                    className="rounded-lg border border-zinc-500 px-3 py-2 text-sm transition hover:bg-zinc-400/50 dark:border-zinc-700 dark:hover:bg-zinc-800"
                  >
                    Voir
                  </Link>
                  <button
                    type="button"
                    onClick={() => startEditing(category)}
                    className="rounded-lg border border-blue-500/40 px-3 py-2 text-sm text-blue-800 transition hover:bg-blue-500/10 dark:text-blue-300"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(category)}
                    disabled={deletingId === category.id || (category.topicsCount ?? 0) > 0}
                    title={(category.topicsCount ?? 0) > 0
                      ? 'Impossible de supprimer une catégorie qui contient des sujets.'
                      : undefined}
                    className="rounded-lg border border-red-500/40 px-3 py-2 text-sm text-red-700 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-300"
                  >
                    {deletingId === category.id ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              </div>
              {(category.topicsCount ?? 0) > 0 && (
                <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-500">
                  Cette catégorie ne peut pas être supprimée car elle contient des sujets.
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
