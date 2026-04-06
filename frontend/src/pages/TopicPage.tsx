import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTopic, type Topic } from "../api/topics";
import { createPost, getPostsByTopic, type Post } from "../api/posts";
import PostCard from "../components/forum/PostCard";
import { useAuthStore } from "../features/auth/authStore";

export default function TopicPage() {
  const { id } = useParams();
  const token = useAuthStore((state) => state.token);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);

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

    await createPost({
      topicId: Number(id),
      content: reply,
    });

    setReply("");
    await loadData();
  }

  if (loading) {
    return <p className="text-zinc-400">Chargement…</p>;
  }

  if (!topic) {
    return <p className="text-red-400">Sujet introuvable.</p>;
  }

  return (
    <div className="space-y-8">
      <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h1 className="text-3xl font-bold">{topic.title}</h1>

        <div className="mt-3 text-sm text-zinc-500">
          Par {topic.author?.displayName || topic.author?.username} •{" "}
          {new Date(topic.createdAt).toLocaleString("fr-FR")}
        </div>

        <div className="mt-6 whitespace-pre-wrap leading-8 text-zinc-300">
          {topic.content}
        </div>
      </article>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Réponses</h2>

        <div className="space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-zinc-500">Aucune réponse pour le moment.</p>
          )}
        </div>
      </section>

      {token && !topic.isLocked && (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="mb-4 text-xl font-semibold">Répondre</h3>

          <form onSubmit={handleReply} className="space-y-4">
            <textarea
              className="min-h-[160px] w-full rounded-xl bg-zinc-800 px-4 py-3 text-zinc-100 outline-none ring-0"
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