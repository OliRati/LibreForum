import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import {dracula} from 'react-syntax-highlighter/dist/esm/styles/prism'

import type { Post } from "../../api/posts";
import { formatDate } from "../../lib/formatDate";
import { isOnline } from "../../utils/auth";
import ReportButton from '../../components/moderation/ReportButton';

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={`${post.author.displayName || post.author?.username} avatar`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-zinc-300">
                {(post.author?.displayName || post.author?.username)?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <Link
              to={`/profile/${post.author?.id}`}
              className="font-medium text-zinc-200 hover:text-zinc-100"
            >
              {post.author?.displayName || post.author?.username}
            </Link>
            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
              {post.author?.lastSeenAt ? (
                <span className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${isOnline(post.author.lastSeenAt) ? 'bg-emerald-500' : 'bg-zinc-500'}`}
                  />
                  <span>{isOnline(post.author.lastSeenAt) ? 'En ligne' : 'Hors ligne'}</span>
                </span>
              ) : (
                <span>Statut indisponible</span>
              )}
            </div>
          </div>
        </div>

        <span className="text-xs text-zinc-500">
          {formatDate(post.createdAt)}
        </span>
      </div>

      <div className="mb-3 p-2 rounded border border-zinc-600 bg-zinc-800 items-left text-left">
        {post.moderationStatus === 'blocked' ? (
          <p className="italic text-red-500">
            Ce message a été bloqué pour non-respect des règles.
          </p>
        ) : (
          <div className="prose lg:prose-xl">

            <ReactMarkdown
              children={post.content}
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      children={String(children).replace(/\n$/, '')}
                      language={match[1]}
                      style={dracula}
                    />
                  ) : (
                    <code {...rest} className={className}>
                      {post.content}
                    </code>
                  )
                }
              }}
            />

          </div>
        )}
      </div>

      <div className="text-end">
        <ReportButton postId={post.id} />
      </div>

    </div>
  );
}