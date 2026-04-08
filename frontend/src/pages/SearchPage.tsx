import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTopics, type Topic } from "../api/topics";
import TopicCard from "../components/forum/TopicCard";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import Pagination from "../components/ui/Pagination";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [input, setInput] = useState(query);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!query.trim()) {
        setTopics([]);
        return;
      }

      setLoading(true);
      try {
        const data = await getTopics({
          search: query,
          page,
          limit: 10,
        });

        setTopics(data.items);
        setTotalPages(data.totalPages);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [query, page]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearchParams({ q: input, page: "1" });
  }

  function handlePageChange(nextPage: number) {
    setPage(nextPage);
    setSearchParams({ q: query, page: String(nextPage) });
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="mb-4 text-3xl font-bold">Recherche</h1>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            className="flex-1 rounded-xl bg-zinc-800 px-4 py-3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Rechercher un sujet..."
          />
          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-500"
          >
            Rechercher
          </button>
        </form>
      </section>

      {loading ? (
        <Loader />
      ) : query.trim() ? (
        <section className="space-y-4">
          {topics.length > 0 ? (
            <>
              {topics.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <EmptyState
              title="Aucun résultat"
              description="Essaie avec un autre mot-clé."
            />
          )}
        </section>
      ) : (
        <EmptyState
          title="Lance une recherche"
          description="Cherche un sujet, une techno ou une discussion."
        />
      )}
    </div>
  );
}