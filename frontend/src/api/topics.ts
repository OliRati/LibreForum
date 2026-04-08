import { api } from "./client";
import type { Tag } from "./tags";

export type TopicAuthor = {
  id: number;
  username: string;
  displayName?: string;
};

export type TopicCategory = {
  id: number;
  name: string;
  slug: string;
};

export type Topic = {
  id: number;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
  isPinned?: boolean;
  isLocked?: boolean;
  author: TopicAuthor;
  category: TopicCategory;
  tags?: Tag[];
};

export type PaginatedTopics = {
  items: Topic[];
  page: number;
  totalPages: number;
  total: number;
};

export async function getTopics(params?: {
  page?: number;
  limit?: number;
  categoryId?: number | string;
  search?: string;
  tagId?: number | string;
}): Promise<PaginatedTopics> {
  const { data } = await api.get("/topics", { params });
  return data;
}

export async function getTopic(id: string | number): Promise<Topic> {
  const { data } = await api.get(`/topics/${id}`);
  return data;
}

export async function createTopic(payload: {
  title: string;
  content: string;
  categoryId: number;
  tagIds?: number[];
}) {
  const { data } = await api.post("/topics", payload);
  return data;
}