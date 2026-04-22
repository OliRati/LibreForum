import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTopic, type Topic } from "../api/topics";

import { type Post } from "../api/posts";
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
import { getTopicPosts, createPost } from "../services/topics.js";
import CreatePostForm from "../components/posts/CreatePostForm.js";
import { subscribeToTopic } from "../lib/mercure";
import ShowMarkdown from "../components/ui/ShowMarkdown";
import Pagination from "../components/ui/Pagination";

const ITEMS_PER_PAGE = 10;

export default function TopicPage() {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  async function loadData() {
    if (!id) return;

    setLoading(true);
    try {
      const [topicData, postsData] = await Promise.all([
        getTopic(id),
        getTopicPosts(Number(id), 1, ITEMS_PER_PAGE),
      ]);
      setTopic(topicData);
      setPosts(postsData.items);
      setCurrentPage(postsData.page);
      setTotalPages(postsData.totalPages);
      setTotal(postsData.total);
    } catch {
      setError("Impossible de charger le sujet.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // S'abonner aux mises à jour Mercure pour ce topic
    const unsubscribe = subscribeToTopic(Number(id), (data) => {
      if (data.type === 'post_created') {
        // Ajouter le nouveau post à la liste
        const newPost = data.post;
        setPosts((prev) => [...prev, newPost]);
      }
    });

    return unsubscribe;
  }, [id]);

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !reply.trim()) return;

    try {
      await createPost(Number(id), reply);

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

  // Charge les posts avec pagination
  const loadPosts = async (page: number = 1) => {
    if (!id) return;

    try {
      const data = await getTopicPosts(Number(id), page, ITEMS_PER_PAGE);
      setPosts(data.items);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (page: number) => {
    loadPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  if (loading) return <Loader />;
  if (!topic) return <EmptyState title="Sujet introuvable" />;

  const moderator = isModerator();

  return (
    <div className="space-y-8">
      {error && <Alert type="error" message={error} />}

      <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold">{topic.title}</h1>

        <div className="mt-2 flex flex-wrap gap-2 items-center justify-between">
          <div>
            <ModerationBadge
              status={topic.moderationStatus}
              isPinned={topic.isPinned}
              isLocked={topic.isLocked}
              toxicityScore={topic.toxicityScore}
            />
          </div>
          <div className="text-end">
            <ReportButton topicId={topic.id} />
          </div>
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

        <div className="mt-6 whitespace-pre-wrap leading-8 text-zinc-300">
          <ShowMarkdown content={topic.content} />
        </div>


        <div className="mb-0 mt-3 flex flex-wrap gap-2 items-center justify-between">
          {moderator && (
            <div>
              <TopicModerationActions topic={topic} onUpdated={loadTopic} />
            </div>
          )}
        </div>

      </article>

      <section>
        <h2 className="mb-4 pb-4 text-2xl font-semibold">Réponses</h2>

        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) =>
              <div className="mb-6">
                <PostCard key={post.id} post={post} />
              </div>
            )
          ) : (
            <EmptyState
              title="Aucune réponse"
              description="Sois le premier à répondre à ce sujet."
            />
          )}
        </div>

        {totalPages > 1 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            total={total}
            itemsPerPage={ITEMS_PER_PAGE}
            showInfo
            variant="light"
          />
        )}
      </section>

      {token && !topic.isLocked && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-4 text-xl font-semibold">Répondre</h3>

          <CreatePostForm topicId={topic.id} onCreated={loadData} />

        </section>
      )}
    </div>
  );
}