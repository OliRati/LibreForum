import { Link } from "react-router-dom";
import type { Topic } from "../../api/topics";
import TagBadge from "./TagBadge";
import ModerationBadge from "../moderation/ModerationBadge.js";
import { formatDate } from "../../lib/formatDate";

type Props = {
  topic: Topic;
};

export default function TopicCard({ topic }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 hover:bg-zinc-800">
      <Link to={`/topic/${topic.id}`} className="block">
        <div className="mb-2 flex items-center gap-2">
          <ModerationBadge
            isPinned={topic.isPinned}
            isLocked={topic.isLocked}
            toxicityScore={topic.toxicityScore}/>
        </div>

        <h3 className="text-xl font-semibold text-zinc-100">{topic.title}</h3>

        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
          {topic.content}
        </p>
      </Link>

      {topic.tags && topic.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {topic.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag.name} />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-4">
          <Link
            to={`/profile/${topic.author?.id}`}
            className="hover:text-zinc-300"
          >
            {topic.author?.displayName || topic.author?.username}
          </Link>
          <span>{topic.postsCount ?? 0} posts</span>
          <span>{topic.participantsCount ?? 0} participants</span>
          {topic.lastContributionAt && (
            <span>Dernière activité: {formatDate(topic.lastContributionAt)}</span>
          )}
        </div>
        <Link
          to={`/category/${topic.category?.id}`}
          className="hover:text-zinc-300"
        >
          {topic.category?.name}
        </Link>
      </div>
    </div>
  );
}