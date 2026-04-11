import { apiFetch } from '../lib/api';
import type { Topic } from '../types/topic';
import type { Post } from '../types/post';

export async function getTopic(id: number): Promise<Topic> {
  return apiFetch(`/api/topics/${id}`);
}

export async function getTopicPosts(id: number): Promise<Post[]> {
  return apiFetch(`/api/topics/${id}/posts`);
}