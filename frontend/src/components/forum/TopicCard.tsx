import { Link } from "react-router-dom";
import type { Topic } from "../../api/topics";

type Props = {
  topic: Topic;
};

export default function TopicCard({ topic }: Props) {
  return (
    <Link
      to={`/topic/${topic.id}`}
      className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 hover:bg-zinc-800"
    >
      <div className="mb-2 flex items-center gap-2">
        {topic.isPinned && (
          <span className="rounded bg-amber-500/20 px-2 py-1 text-xs text-amber-300">
            Épinglé
          </span>
        )}
        {topic.isLocked && (
          <span className="rounded bg-red-500/20 px-2 py-1 text-xs text-red-300">
            Verrouillé
          </span>
        )}
      </div>

      <h3 className="text-xl font-semibold text-zinc-100">{topic.title}</h3>

      <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
        {topic.content}
      </p>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <span>{topic.author?.displayName || topic.author?.username}</span>
        <span>{topic.category?.name}</span>
      </div>
    </Link>
  );
}