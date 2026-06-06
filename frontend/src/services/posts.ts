import { apiFetch } from '../lib/api';
import type { Post } from '../api/posts';

export async function getPost(postId: number): Promise<Post> {
  return apiFetch<Post>(`/api/posts/${postId}`);
}

export async function deletePost(postId: number) {
  return apiFetch(`/api/posts/${postId}`, {
    method: 'DELETE',
  });
}
