import { Link } from "react-router-dom";
import type { Topic } from "../../api/topics";
import TagBadge from "./TagBadge";
import ModerationBadge from "../moderation/ModerationBadge.js";
import { formatDate } from "../../lib/formatDate";
import ShowMarkdown from "../ui/ShowMarkdown";

type Props = {
  topic: Topic;
};

export default function TopicCard({ topic }: Props) {
  return (
    <article className="relative rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700 hover:bg-zinc-800">
      <div className="mb-2 flex items-center gap-2">
        <ModerationBadge
          status={topic.moderationStatus}
          isPinned={topic.isPinned}
          isLocked={topic.isLocked}
          toxicityScore={topic.toxicityScore} />
      </div>

      <h3 className="text-xl font-semibold text-zinc-100">
        <Link
          to={`/topic/${topic.id}`}
          className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-sky-400"
        >
          {topic.title}
        </Link>
      </h3>

      <div className="mt-2 line-clamp-2 text-sm text-zinc-400 [&_a]:relative [&_a]:z-10">
        <ShowMarkdown content={topic.content} />
      </div>

      {topic.tags && topic.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 [&_a]:relative [&_a]:z-10">
          {topic.tags.map((tag) => (
            <TagBadge key={tag.id} tagName={tag.name} />
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-zinc-500">
        <div className="flex flex-wrap items-center gap-x-4">
          <Link
            to={`/profile/${topic.author?.id}`}
            className="relative z-10 hover:text-zinc-300"
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
          className="relative z-10 hover:text-zinc-300"
        >
          {topic.category?.name}
        </Link>
      </div>
    </article>
  );
}