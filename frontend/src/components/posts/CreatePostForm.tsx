import { useState } from 'react';
import { createPost } from '../../services/topics';
import TextAssistant from '../ai/TextAssistant';

interface Props {
  topicId: number;
  onCreated: () => void;
}

export default function CreatePostForm({ topicId, onCreated }: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if (!content.trim()) {
      setError('Message vide.');
      return;
    }

    try {
      setLoading(true);

      await createPost(topicId, content);

      setContent('');
      onCreated(); // reload posts
    } catch (err) {
      console.error(err);
      setError('Erreur lors de l’envoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[160px] w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-zinc-100 outline-none"
        placeholder="Votre réponse..."
      />

      {/* Assistant IA */}
      <TextAssistant value={content} onChange={setContent} />

      {error && <div className="text-red-600 mt-2">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="cursor-pointer rounded-xl bg-emerald-600 px-5 py-3 mt-6 font-medium hover:bg-emerald-700"
      >
        {loading ? 'Envoi en cours...' : 'Publier la réponse'}
      </button>
    </>
  );
}