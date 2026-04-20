import { api } from "./client";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  topicsCount?: number;
  postsCount?: number;
  participantsCount?: number;
  lastContributionAt?: string | null;
};

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get("/categories");
  return data;
}

export async function getCategory(id: string | number): Promise<Category> {
  const { data } = await api.get(`/categories/${id}`);
  return data;
}