import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTopic, type Topic } from "../api/topics";

import { createPost, getPostsByTopic, type Post } from "../api/posts";
import PostCard from "../components/forum/PostCard";
import { useAuthStore } from "../features/auth/authStore";
import Loader from "../components/ui/Loader";
import EmptyState from "../components/ui/EmptyState";
import TagBadge from "../components/forum/TagBadge";
import { formatDate } from "../lib/formatDate";
import Alert from "../components/ui/Alert";
import ModerationBadge from '../components/moderation/ModerationBadge';
import ReportButton from '../components/moderation/ReportButton';
import TopicModerationActions from '../components/moderation/TopicModerationActions';
import PostModerationActions from '../components/moderation/PostModerationActions';
import { isModerator } from '../utils/auth';

export default function TopicPage() {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadData() {
    if (!id) return;

    setLoading(true);
    try {
      const [topicData, postsData] = await Promise.all([
        getTopic(id),
        getPostsByTopic(id),
      ]);
      setTopic(topicData);
      setPosts(postsData);
    } catch {
      setError("Impossible de charger le sujet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !reply.trim()) return;

    try {
      await createPost({
        topicId: Number(id),
        content: reply,
      });

      setReply("");
      await loadData();
    } catch {
      setError("Impossible de publier la réponse.");
    }
  }

  // Charge le topic
  const loadTopic = async () => {
    if (!id) return;

    try {
      const data = await getTopic(Number(id));
      setTopic(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Charge les posts
  const loadPosts = async () => {
    if (!id) return;

    try {
      const data = await getTopicPosts(Number(id));
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };


  if (loading) return <Loader />;
  if (!topic) return <EmptyState title="Sujet introuvable" />;


  return (
    <div className="space-y-8">
      {error && <Alert type="error" message={error} />}

      <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold">{topic.title}</h1>

        <div className="mt-2">
          <ModerationBadge
            status={topic.moderationStatus}
            isPinned={topic.isPinned}
            isLocked={topic.isLocked}
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
          <span>
            Par{" "}
            <Link to={`/profile/${topic.author?.id}`} className="hover:text-zinc-300">
              {topic.author?.displayName || topic.author?.username}
            </Link>
          </span>
          <span>•</span>
          <span>{formatDate(topic.createdAt)}</span>
          <span>•</span>
          <Link to={`/category/${topic.category?.id}`} className="hover:text-zinc-300">
            {topic.category?.name}
          </Link>
        </div>

        {topic.tags && topic.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {topic.tags.map((tag) => (
              <TagBadge key={tag.id} tag={tag.name} />
            ))}
          </div>
        )}

        {isModerator && (
          <div className="mb-6">
            <TopicModerationActions topic={topic} onUpdated={loadTopic} />
          </div>
        )}

        <div className="mt-6 whitespace-pre-wrap leading-8 text-zinc-300">
          {topic.content}
        </div>

        <ReportButton topicId={topic.id} />

      </article>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Réponses</h2>

        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) =>
              <>
                <PostCard key={post.id} post={post} />
                <div className="mt-3 flex items-center justify-between">
                  <ModerationBadge status={post.moderationStatus} />

                  <div className="flex gap-2">
                    <ReportButton postId={post.id} />

                    {isModerator && (
                      <PostModerationActions post={post} onUpdated={loadPosts} />
                    )}
                  </div>
                </div>
              </>
            )
          ) : (
            <EmptyState
              title="Aucune réponse"
              description="Sois le premier à répondre à ce sujet."
            />
          )}
        </div>
      </section>

      {token && !topic.isLocked && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-4 text-xl font-semibold">Répondre</h3>

          <form onSubmit={handleReply} className="space-y-4">
            <textarea
              className="min-h-[160px] w-full rounded-xl bg-zinc-800 px-4 py-3 text-zinc-100 outline-none"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Votre réponse..."
            />

            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-3 font-medium hover:bg-emerald-500"
            >
              Publier la réponse
            </button>
          </form>
        </section>
      )}
    </div>
  );
}