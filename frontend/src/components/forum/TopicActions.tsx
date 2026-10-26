import { useState } from 'react';
import { lockTopic, pinTopic } from '../../services/moderation';
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

  return (
    <div className="flex items-center gap-2 text-zinc-200">
      
      <button
        disabled={loading}
        onClick={handlePin}
        className="rounded border border-red-300 text-red-100 px-3 py-1 text-sm hover:bg-red-800/20 transition-all cursor-pointer"
      >
        {topic.isPinned ? 'Désépingler' : 'Épingler'}
      </button>

      <button
        disabled={loading}
        onClick={handleLock}
        className="rounded border border-red-300 text-red-100 px-3 py-1 text-sm hover:bg-red-800/20 transition-all cursor-pointer"
      >
        {topic.isLocked ? 'Déverrouiller' : 'Verrouiller'}
      </button>

    </div>
  );
}