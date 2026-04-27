import { useState } from 'react';
import {
  lockTopic,
  moderateTopic,
  pinTopic,
} from '../../services/moderation';
import type { Topic } from '../../types/topic';

interface TopicModerationActionsProps {
  topic: Topic;
  onUpdated?: () => void;
}

export default function TopicModerationActions({
  topic,
  onUpdated,
}: TopicModerationActionsProps) {
  const [loading, setLoading] = useState(false);

  const handlePin = async () => {
    try {
      setLoading(true);
      await pinTopic(topic.id, !topic.isPinned, 'Action modérateur');
      onUpdated?.();
    } catch (err) {
      console.error(err);
      alert("Impossible de modifier l'état épinglé.");
    } finally {
      setLoading(false);
    }
  };

  const handleLock = async () => {
    try {
      setLoading(true);
      await lockTopic(topic.id, !topic.isLocked, 'Action modérateur');
      onUpdated?.();
    } catch (err) {
      console.error(err);
      alert("Impossible de modifier l'état verrouillé.");
    } finally {
      setLoading(false);
    }
  };

  const handleModerate = async (status: string) => {
    try {
      setLoading(true);
      await moderateTopic(topic.id, status, 'Action modérateur');
      onUpdated?.();
    } catch (err) {
      console.error(err);
      alert("Impossible de modérer ce topic.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-1 flex flex-wrap gap-2 rounded border border-zinc-400 text-zinc-200 bg-gray-600 p-3">
      <button
        disabled={loading}
        onClick={handlePin}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-500"
      >
        {topic.isPinned ? 'Désépingler' : 'Épingler'}
      </button>

      <button
        disabled={loading}
        onClick={handleLock}
        className="rounded border px-3 py-1 text-sm hover:bg-gray-500"
      >
        {topic.isLocked ? 'Déverrouiller' : 'Verrouiller'}
      </button>

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