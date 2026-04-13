import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getCategory, type Category } from "../api/categories";
import { getTopics, type Topic } from "../api/topics";
import TopicCard from "../components/forum/TopicCard";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";
import { isUser } from '../utils/auth';

export default function CategoryPage() {
  const { id } = useParams();

  const [category, setCategory] = useState<Category | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;

      setLoading(true);
      try {
        const [categoryData, topicsData] = await Promise.all([
          getCategory(id),
          getTopics({ categoryId: id, page, limit: 10 }),
        ]);

        setCategory(categoryData);
        setTopics(topicsData.items);
        setTotalPages(topicsData.totalPages);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, page]);

  if (loading) return <Loader />;
  if (!category) return <EmptyState title="Catégorie introuvable" />;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="mt-3 text-zinc-400">
          {category.description || "Aucune description"}
        </p>
      </section>

      <section className="space-y-4">
        {topics.length > 0 ? (
          topics.map((topic) => <TopicCard key={topic.id} topic={topic} />)
        ) : (
          <EmptyState
            title="Aucun sujet dans cette catégorie"
            description="Sois le premier à lancer une discussion."
          />
        )}
      </section>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}