import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getTopic, getTopicPosts } from '../services/topics';
import type { Topic } from '../types/topic';
import type { Post } from '../types/post';

import ModerationBadge from '../components/moderation/ModerationBadge';
import ReportButton from '../components/moderation/ReportButton';
import TopicModerationActions from '../components/moderation/TopicModerationActions';
import PostModerationActions from '../components/moderation/PostModerationActions';

import CreatePostForm from '../components/posts/CreatePostForm';
import TopicSummaryCard from '../components/ai/TopicSummaryCard';

import { isModerator } from '../utils/auth';

export default function TopicDetailPage() {
    const { id } = useParams();

    const [topic, setTopic] = useState<Topic | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    const moderator = isModerator();

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

    // Chargement initial
    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([loadTopic(), loadPosts()]);
            setLoading(false);
        };

        loadAll();
    }, [id]);

    if (loading || !topic) {
        return <div className="p-6">Chargement...</div>;
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            {/* HEADER TOPIC */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold">{topic.title}</h1>

                    <ReportButton topicId={topic.id} />
                </div>

                <div className="mt-2">
                    <ModerationBadge
                        status={topic.moderationStatus}
                        isPinned={topic.isPinned}
                        isLocked={topic.isLocked}
                        toxicityScore={topic.toxicityScore}
                    />
                </div>
            </div>

            <TopicSummaryCard topicId={topic.id} summary={topic.summary} />

            {/* ACTIONS MODÉRATION */}
            {moderator && (
                <div className="mb-6">
                    <TopicModerationActions
                        topic={topic}
                        onUpdated={loadTopic}
                    />
                </div>
            )}

            {/* POSTS */}
            <div className="space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="rounded-xl border p-4">
                        <div className="mb-2 text-sm text-gray-600">
                            {post.author?.username}
                        </div>

                        {post.moderationStatus === 'blocked' ? (
                            <div className="italic text-red-500">
                                Ce message a été bloqué pour non-respect des règles.
                            </div>
                        ) : (
                            <div className="mb-3">{post.content}</div>
                        )}

                        <div className="flex items-center justify-between">
                            <ModerationBadge status={post.moderationStatus} />

                            <div className="flex gap-2">
                                <ReportButton postId={post.id} />

                                {moderator && (
                                    <PostModerationActions
                                        post={post}
                                        onUpdated={loadPosts}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <CreatePostForm
                topicId={topic.id}
                onCreated={loadPosts}
            />
        </div>
    );
}