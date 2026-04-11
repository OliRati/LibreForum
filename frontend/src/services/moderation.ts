import { apiFetch } from '../lib/api';

export async function pinTopic(topicId: number, pinned: boolean, reason?: string) {
  return apiFetch(`/api/topics/${topicId}/pin`, {
    method: 'PATCH',
    body: JSON.stringify({ pinned, reason }),
  });
}

export async function lockTopic(topicId: number, locked: boolean, reason?: string) {
  return apiFetch(`/api/topics/${topicId}/lock`, {
    method: 'PATCH',
    body: JSON.stringify({ locked, reason }),
  });
}

export async function moderateTopic(topicId: number, status: string, reason?: string) {
  return apiFetch(`/api/topics/${topicId}/moderate`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
  });
}

export async function moderatePost(postId: number, status: string, reason?: string) {
  return apiFetch(`/api/posts/${postId}/moderate`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason }),
  });
}