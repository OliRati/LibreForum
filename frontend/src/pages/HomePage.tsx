import { useEffect, useState } from "react";
import { getCategories, type Category } from "../api/categories";
import { getTopics, type Topic } from "../api/topics";
import CategoryCard from "../components/forum/CategoryCard";
import TopicCard from "../components/forum/TopicCard";
import Loader from "../components/ui/Loader";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [categoriesData, topicsData] = await Promise.all([
          getCategories(),
          getTopics({ page, limit: 10 }),
        ]);
        setCategories(categoriesData);
        setTopics(topicsData.items);
        setTotalPages(topicsData.totalPages);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [page]);

  if (loading) return <Loader />;

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

        {topics.length > 0 ? (
          <>
            <div className="space-y-4">
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : (
          <EmptyState
            title="Aucun sujet pour le moment"
            description="Crée le premier sujet de LibreForum."
          />
        )}
      </section>
    </div>
  );
}