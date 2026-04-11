import { apiFetch } from '../lib/api';
import type { Topic } from '../types/topic';
import type { Post } from '../types/post';

export async function getTopic(id: number): Promise<Topic> {
  return apiFetch(`/api/topics/${id}`);
}

export async function getTopicPosts(id: number): Promise<Post[]> {
  return apiFetch(`/api/topics/${id}/posts`);
}

export async function createTopic(payload: {
  title: string;
  content: string;
  tags?: string[];
}) {
  return apiFetch('/api/topics', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createPost(topicId: number, content: string) {
  return apiFetch(`/api/topics/${topicId}/posts`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}