import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategories, type Category } from "../api/categories";
import { getTopicsByCategory, type Topic } from "../api/topics";
import TopicCard from "../components/forum/TopicCard";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import SectionTitle from "../components/ui/SectionTitle";

export default function CategoryPage() {
  const { id } = useParams();

  const [category, setCategory] = useState<Category | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      setLoading(true);
      try {
        const [categories, topicsData] = await Promise.all([
          getCategories(),
          getTopicsByCategory(id),
        ]);

        const found = categories.find((c) => String(c.id) === id) || null;
        setCategory(found);
        setTopics(topicsData);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <Loader />;

  if (!category) {
    return (
      <EmptyState
        title="Catégorie introuvable"
        description="La catégorie demandée n’existe pas ou a été supprimée."
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionTitle
        title={category.name}
        subtitle={category.description || "Discussion autour de cette catégorie"}
      />

      {topics.length > 0 ? (
        <div className="space-y-4">
          {topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucun sujet dans cette catégorie"
          description="Sois le premier à lancer une discussion."
        />
      )}
    </div>
  );
}