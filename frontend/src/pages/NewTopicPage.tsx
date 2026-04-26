import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTopic } from "../api/topics";
import { getCategories, type Category } from "../api/categories";
import { getTags, createTag, type Tag } from "../api/tags";
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import Alert from "../components/ui/Alert";

import TagSuggestion from '../components/ai/TagSuggestion';
import TextAssistant from '../components/ai/TextAssistant';

export default function NewTopicPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      const [categoriesData, tagsData] = await Promise.all([
        getCategories(),
        getTags(),
      ]);

      setCategories(categoriesData);
      setTags(tagsData);

      if (categoriesData.length > 0) {
        setCategoryId(categoriesData[0].id);
      }
    }

    loadData();
  }, []);

  function toggleTag(tagId: number) {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  async function newTag(tagName: string) {
    // Vérifier si le tag existe déjà dans la liste
    const existingTag = tags.find(tag => tag.name.toLowerCase() === tagName.toLowerCase());

    if (existingTag) {
      // Le tag existe, l'ajouter aux tags sélectionnés s'il n'y est pas déjà
      setSelectedTags((prev) =>
        prev.includes(existingTag.id) ? prev : [...prev, existingTag.id]
      );
    } else {
      // Le tag n'existe pas, le créer via l'API
      const newTag = await createTag({ name: tagName });

      // Ajouter le nouveau tag à la liste
      setTags((prev) => [...prev, newTag]);

      // L'ajouter aux tags sélectionnés
      setSelectedTags((prev) => [...prev, newTag.id]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const result = await createTopic({
        title,
        content,
        categoryId: Number(categoryId),
        tagIds: selectedTags,
      });

      navigate(`/topic/${result.id}`);
    } catch {
      setError("Impossible de créer le sujet.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="mb-6 text-3xl font-bold">Créer un nouveau sujet</h1>

      {error && <div className="mb-4"><Alert type="error" message={error} /></div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm text-zinc-400">Titre</label>
          <input
            id="title"
            className="w-full rounded-xl bg-zinc-800 px-4 py-3 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre du sujet"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="categories" className="block mb-2 text-sm text-zinc-400">Catégorie</label>
          <div className="mt-2 grid grid-cols-1">
            <select
              className="col-start-1 row-start-1 w-full appearance-none rounded-xl bg-white/5 py-3 pr-8 pl-3 text-base text-white outline-1 -outline-offset-1 outline-white/10 *:bg-gray-800 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-400 sm:size-4"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const active = selectedTags.includes(tag.id);

              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-2 text-sm transition ${active
                    ? "bg-emerald-600 text-white border border-emerald-500"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-600"
                    }`}
                >
                  #{tag.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm text-zinc-400">Contenu</label>
          <textarea
            className="min-h-[220px] w-full rounded-xl bg-zinc-800 px-4 py-3 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Décris ton sujet…"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-500"
        >
          Publier le sujet
        </button>
      </form>

      {/* Assistant IA */}
      <TextAssistant value={content} onChange={setContent} />

      {/* Tags IA */}
      <TagSuggestion
        content={content}
        onSelect={(tagName) => newTag(tagName)
        }
      />

    </div>
  );
}