import { useState } from 'react';
import { apiFetch } from '../../lib/api';

export default function TopicSummaryCard({ topicId, summary }: any) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(summary);

  const generate = async () => {
    setLoading(true);

    const res = await apiFetch(`/api/llm/topics/${topicId}/summary`, {
      method: 'POST',
    });

    setData(res.summary);
    setLoading(false);
  };

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-2 font-semibold">Résumé IA</div>

      {data ? (
        <p className="text-sm text-gray-700">{data}</p>
      ) : (
        <button
          onClick={generate}
          className="rounded bg-black px-3 py-2 text-sm text-white"
        >
          {loading ? 'Génération...' : 'Générer un résumé'}
        </button>
      )}
    </div>
  );
}