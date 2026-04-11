import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { createTopic } from '../../services/topics';
import TagSuggestion from '../../components/ai/TagSuggestion';
import TextAssistant from '../../components/ai/TextAssistant';

export default function CreateTopicPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Titre et contenu requis.');
      return;
    }

    try {
      setLoading(true);

      const topic = await createTopic({
        title,
        content,
        tags,
      });

      navigate(`/topics/${topic.id}`);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Créer un topic</h1>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Titre du topic"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border px-3 py-2"
        />

        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] w-full rounded border px-3 py-2"
        />

        {/* Assistant IA */}
        <TextAssistant value={content} onChange={setContent} />

        {/* Tags IA */}
        <TagSuggestion
          content={content}
          onSelect={(newTags) =>
            setTags((prev) => [...new Set([...prev, ...newTags])])
          }
        />

        {/* Tags sélectionnés */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-gray-200 px-2 py-1 text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {error && <div className="text-red-600">{error}</div>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white"
        >
          {loading ? 'Création...' : 'Créer le topic'}
        </button>
      </div>
    </div>
  );
}