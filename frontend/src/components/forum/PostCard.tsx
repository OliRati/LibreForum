import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Post } from "../../api/posts";
import { formatDate } from "../../lib/formatDate";
import { isOnline } from "../../utils/auth";
import ReportButton from '../../components/moderation/ReportButton';
import ShowMarkdown from "../ui/ShowMarkdown";

import ModerationBadge from '../../components/moderation/ModerationBadge';
import PostModerationActions from '../../components/moderation/PostModerationActions';
import { isModerator } from '../../utils/auth';
import { getPost } from "../../services/posts";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  const [curPost, setCurPost] = useState<Post>(post);
  const moderator = isModerator();

  // Charge le post unique pour rafraîchir l'affichage
  const loadPosts = async () => {
    try {
      const data = await getPost(Number(post.id));
      setCurPost(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800">
            {curPost.author?.avatar ? (
              <img
                src={curPost.author.avatar}
                alt={`${curPost.author.displayName || curPost.author?.username} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-zinc-300">
                {(curPost.author?.displayName || curPost.author?.username)?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <Link
              to={`/profile/${curPost.author?.id}`}
              className="font-medium text-zinc-200 hover:text-zinc-100"
            >
              {curPost.author?.displayName || curPost.author?.username}
            </Link>
            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
              {curPost.author?.lastSeenAt ? (
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${isOnline(curPost.author.lastSeenAt) ? 'bg-emerald-500' : 'bg-zinc-500'}`}
                  />
                  <span>{isOnline(curPost.author.lastSeenAt) ? 'En ligne' : 'Hors ligne'}</span>
                </span>
              ) : (
                <span>Statut indisponible</span>
              )}
            </div>
          </div>
        </div>

        <span className="text-xs text-zinc-500">
          {formatDate(curPost.createdAt)}
        </span>
      </div>

      <div className="mb-3 p-2 rounded border border-zinc-600 bg-zinc-800 items-left text-left">
        {curPost.moderationStatus === 'blocked' ? (
          <p className="italic text-red-500">
            Ce message a été bloqué pour non-respect des règles.
          </p>
        ) : (
          <ShowMarkdown content={String(curPost.content)} />
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div>
          <ModerationBadge
            status={curPost.moderationStatus}
            toxicityScore={curPost.toxicityScore} />
        </div>
        {moderator && (
          <div>
            <PostModerationActions post={curPost} onUpdated={loadPosts} />
          </div>
        )}
        <div className="text-end">
          <ReportButton postId={curPost.id} />
        </div>
      </div>

    </div>
  );
}