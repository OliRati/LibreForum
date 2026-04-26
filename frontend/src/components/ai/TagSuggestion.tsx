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
    <div className="rounded-xl border bg-cyan-950 border-cyan-800 p-4 mt-4">
      <div className="mb-2 font-semibold">Suggestions IA</div>

      {tags.length === 0 ? (
        <button
          onClick={generate}
          className="cursor-pointer rounded-xl px-3 py-2 bg-cyan-700 hover:bg-cyan-800 mr-2"
        >
          {loading ? 'Analyse en cours...' : 'Suggérer des tags'}
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="cursor-pointer rounded-full border border-cyan-700 hover:border-cyan-600 px-3 py-1 text-sm bg-cyan-900 hover:bg-cyan-800"
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}