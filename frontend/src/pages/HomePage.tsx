import { useEffect, useState } from "react";
import { getCategories, type Category } from "../api/categories";
import { getTopics, type Topic } from "../api/topics";
import CategoryCard from "../components/forum/CategoryCard";
import TopicCard from "../components/forum/TopicCard";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [categoriesData, topicsData] = await Promise.all([
          getCategories(),
          getTopics(),
        ]);
        setCategories(categoriesData);
        setTopics(topicsData);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <p className="text-zinc-400">Chargement…</p>;
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-4 text-3xl font-bold">Bienvenue sur LibreForum</h1>
        <p className="text-zinc-400">
          Forum communautaire autour du logiciel libre, du code et des projets open source.
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Catégories</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Derniers sujets</h2>
        <div className="space-y-4">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  );
}