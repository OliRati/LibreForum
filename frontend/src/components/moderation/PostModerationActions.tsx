import { useState } from 'react';
import { moderatePost } from '../../services/moderation';
import type { Post } from '../../types/post';

interface PostModerationActionsProps {
  postId: number;
  onUpdated?: () => void;
}

export default function PostModerationActions({
  postId,
  onUpdated,
}: PostModerationActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleModerate = async (status: string) => {
    try {
      setLoading(true);
      await moderatePost(postId, status, 'Action modérateur');
      onUpdated?.();
    } catch (err) {
      console.error(err);
      alert('Impossible de modérer ce message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 flex flex-wrap gap-2 rounded border border-zinc-400 text-zinc-200 bg-gray-600 p-3">
      <button
        disabled={loading}
        onClick={() => handleModerate('approved')}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-500 transition-all cursor-pointer"
      >
        Valider
      </button>

      <button
        disabled={loading}
        onClick={() => handleModerate('reported')}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-500 transition-all cursor-pointer"
      >
        Signaler
      </button>

      <button
        disabled={loading}
        onClick={() => handleModerate('blocked')}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-500 transition-all cursor-pointer"
      >
        Bloquer
      </button>
    </div>
  );
}