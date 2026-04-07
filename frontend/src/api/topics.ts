import { api } from "./client";

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

export type TopicTag = {
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
  tags?: TopicTag[];
};

export async function getTopics(): Promise<Topic[]> {
  const { data } = await api.get("/topics");
  return data;
}

export async function getTopicsByCategory(categoryId: string | number): Promise<Topic[]> {
  const { data } = await api.get(`/topics?categoryId=${categoryId}`);
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