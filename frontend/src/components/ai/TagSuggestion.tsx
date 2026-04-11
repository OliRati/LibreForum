import { useState } from 'react';
import { suggestTags } from '../../services/llm';

interface Props {
  content: string;
  onSelect: (tags: string[]) => void;
}

export default function TagSuggestion({ content, onSelect }: Props) {
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const generate = async () => {
    setLoading(true);

    try {
      const result = await suggestTags(content);
      setTags(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    onSelect([tag]);
  };

  return (
    <div className="rounded-xl border p-4">
      <div className="mb-2 font-semibold">Suggestions IA</div>

      {tags.length === 0 ? (
        <button
          onClick={generate}
          className="rounded bg-black px-3 py-2 text-sm text-white"
        >
          {loading ? 'Analyse...' : 'Suggérer des tags'}
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="rounded-full border px-3 py-1 text-sm hover:bg-gray-100"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}