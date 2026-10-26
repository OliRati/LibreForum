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
    <div className="flex items-center gap-2 text-zinc-200">
      <div className="text-red-300">
        Modération :
      </div>
      <button
        disabled={loading}
        onClick={() => handleModerate('approved')}
        className="rounded border border-red-300 text-red-100 px-3 py-1 text-sm hover:bg-red-800/20 transition-all cursor-pointer"
      >
        Valider
      </button>

      <button
        disabled={loading}
        onClick={() => handleModerate('blocked')}
        className="rounded border border-red-300 text-red-100 px-3 py-1 text-sm hover:bg-red-800/20 transition-all cursor-pointer"
      >
        Bloquer
      </button>
    </div>
  );
}