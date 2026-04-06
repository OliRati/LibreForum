import type { Post } from "../../api/posts";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium text-zinc-200">
          {post.author?.displayName || post.author?.username}
        </span>
        <span className="text-xs text-zinc-500">
          {new Date(post.createdAt).toLocaleString("fr-FR")}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
        {post.content}
      </p>
    </div>
  );
}