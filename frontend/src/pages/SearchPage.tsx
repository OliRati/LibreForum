import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchTopics } from "../api/search";
import type { Topic } from "../api/topics";
import TopicCard from "../components/forum/TopicCard";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import SectionTitle from "../components/ui/SectionTitle";

export default function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [results, setResults] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!query.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchTopics(query);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [query]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      <SectionTitle
        title={`Résultats pour “${query}”`}
        subtitle={`${results.length} sujet(s) trouvé(s)`}
      />

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((topic) => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Aucun résultat"
          description="Essaie avec d’autres mots-clés."
        />
      )}
    </div>
  );
}