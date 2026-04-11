import { Link } from "react-router-dom";
import type { Post } from "../../api/posts";
import { formatDate } from "../../lib/formatDate";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <Link
          to={`/profile/${post.author?.id}`}
          className="font-medium text-zinc-200 hover:text-zinc-100"
        >
          {post.author?.displayName || post.author?.username}
        </Link>

        <span className="text-xs text-zinc-500">
          {formatDate(post.createdAt)}
        </span>
      </div>

      {post.moderationStatus === 'blocked' ? (
        <p className="italic text-red-500">
          Ce message a été bloqué pour non-respect des règles.
        </p>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
          {post.content}
        </p>
      )}
    </div>
  );
}