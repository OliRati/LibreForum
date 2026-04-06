import { api } from "./client";

export type Post = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
  author: {
    id: number;
    username: string;
    displayName?: string;
  };
};

export async function getPostsByTopic(topicId: string | number): Promise<Post[]> {
  const { data } = await api.get(`/posts?topicId=${topicId}`);
  return data;
}

export async function createPost(payload: {
  topicId: number;
  content: string;
}) {
  const { data } = await api.post("/posts", payload);
  return data;
}