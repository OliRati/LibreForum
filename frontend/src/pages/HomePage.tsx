import { useEffect, useState } from "react";
import { getCategories, type Category } from "../api/categories";
import { getTopics, type Topic } from "../api/topics";
import CategoryCard from "../components/forum/CategoryCard";
import TopicCard from "../components/forum/TopicCard";
import Loader from "../components/ui/Loader";
import Pagination from "../components/ui/Pagination";
import EmptyState from "../components/ui/EmptyState";
import { Link } from "react-router-dom";
import { isModerator } from '../utils/auth';

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

      {isModerator() && (
        <section className="text-left p-3 bg-amber-950 border border-amber-800 rounded-xl">
          <Link to={'/moderation/reports'} className="hover:text-zinc-300">
            Gérer les signalements
          </Link>
        </section>
      )}

      <section>
        <h1 className="mb-4 text-3xl font-bold">Bienvenue sur LibreForum</h1>
        <p className="text-zinc-400">
          LibreForum est un forum communautaire dédiée à l'echange, à l'entraide et au partage de connaissance autour de l'informatique en général, du logiciel libre, de l'open-source et de son écosystèmes.
        </p>
      </section>

      <section>
        <h2 className="pb-6 text-2xl font-semibold">Catégories</h2>
        {categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aucune catégorie pour le moment"
            description="Crée la premiere catégorie de LibreForum."
          />
        )}
      </section>

      <section>
        <h2 className="pb-6 text-2xl font-semibold">Derniers sujets</h2>

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