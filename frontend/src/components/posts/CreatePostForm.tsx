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
    <div className="mt-6 rounded-xl border p-4">
      <h3 className="mb-3 font-semibold">Répondre</h3>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[120px] w-full rounded border px-3 py-2"
        placeholder="Votre réponse..."
      />

      {/* 🤖 Assistant IA */}
      <TextAssistant value={content} onChange={setContent} />

      {error && <div className="text-red-600 mt-2">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 rounded bg-black px-4 py-2 text-white"
      >
        {loading ? 'Envoi...' : 'Envoyer'}
      </button>
    </div>
  );
}