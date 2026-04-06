import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTopic } from "../api/topics";
import { getCategories, type Category } from "../api/categories";

export default function NewTopicPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
      if (data.length > 0) {
        setCategoryId(data[0].id);
      }
    }

    loadCategories();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const result = await createTopic({
        title,
        content,
        categoryId: Number(categoryId),
      });

      navigate(`/topic/${result.id}`);
    } catch {
      setError("Impossible de créer le sujet.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="mb-6 text-3xl font-bold">Créer un nouveau sujet</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm text-zinc-400">Titre</label>
          <input
            className="w-full rounded-xl bg-zinc-800 px-4 py-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du sujet"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Catégorie</label>
          <select
            className="w-full rounded-xl bg-zinc-800 px-4 py-3"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Contenu</label>
          <textarea
            className="min-h-[220px] w-full rounded-xl bg-zinc-800 px-4 py-3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Décris ton sujet…"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-500"
        >
          Publier le sujet
        </button>
      </form>
    </div>
  );
}