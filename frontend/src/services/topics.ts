import { apiFetch } from '../lib/api';
import type { Topic } from '../types/topic';
import type { Post } from '../types/post';

export type PaginatedPosts = {
  items: Post[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function getTopic(id: number): Promise<Topic> {
  return apiFetch(`/api/topics/${id}`);
}

export async function getTopicPosts(id: number, page?: number, limit?: number): Promise<PaginatedPosts> {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  const queryString = params.toString();
  const url = queryString ? `/api/topics/${id}/posts?${queryString}` : `/api/topics/${id}/posts`;
  return apiFetch<PaginatedPosts>(url);
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