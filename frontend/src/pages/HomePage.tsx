import { useEffect, useState } from "react";
import { getCategories, type Category } from "../api/categories";
import { getTopics, type Topic } from "../api/topics";
import CategoryCard from "../components/forum/CategoryCard";
import TopicCard from "../components/forum/TopicCard";
import Loader from "../components/ui/Loader";
import SectionTitle from "../components/ui/SectionTitle";
import EmptyState from "../components/ui/EmptyState";

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

  if (loading) return <Loader />;

  return (
    <div className="space-y-10">
      <section>
        <h1 className="mb-4 text-3xl font-bold">Bienvenue sur LibreForum</h1>
        <p className="text-zinc-400">
          Forum communautaire autour du logiciel libre, du développement et des projets open source.
        </p>
      </section>

      <section>
        <SectionTitle
          title="Catégories"
          subtitle="Explore les grands espaces de discussion"
        />

        {categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune catégorie disponible"
            description="Le forum n’a pas encore été structuré."
          />
        )}
      </section>

      <section>
        <SectionTitle
          title="Derniers sujets"
          subtitle="Les discussions les plus récentes"
        />

        {topics.length > 0 ? (
          <div className="space-y-4">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucun sujet pour le moment"
            description="Commence la première discussion."
          />
        )}
      </section>
    </div>
  );
}