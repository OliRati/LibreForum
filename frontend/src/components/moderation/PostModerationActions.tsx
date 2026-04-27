import { useState } from 'react';
import { moderatePost } from '../../services/moderation';
import type { Post } from '../../types/post';

interface PostModerationActionsProps {
  post: Post;
  onUpdated?: () => void;
}

export default function PostModerationActions({
  post,
  onUpdated,
}: PostModerationActionsProps) {
  const [loading, setLoading] = useState(false);

  const handleModerate = async (status: string) => {
    try {
      setLoading(true);
      await moderatePost(post.id, status, 'Action modérateur');
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
        className="rounded border px-3 py-1 text-sm hover:bg-gray-500"
      >
        Valider
      </button>

      <button
        disabled={loading}
        onClick={() => handleModerate('flagged')}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-500"
      >
        Signaler
      </button>

      <button
        disabled={loading}
        onClick={() => handleModerate('blocked')}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-500"
      >
        Bloquer
      </button>
    </div>
  );
}