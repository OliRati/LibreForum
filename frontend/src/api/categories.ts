import { api } from "./client";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  topicsCount?: number;
  postsCount?: number;
  participantsCount?: number;
  lastContributionAt?: string | null;
};

export type CategoryPayload = {
  name: string;
  description?: string | null;
  icon?: string | null;
};

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get("/categories");
  return data;
}

export async function getCategory(id: string | number): Promise<Category> {
  const { data } = await api.get(`/categories/${id}`);
  return data;
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const { data } = await api.post("/categories", payload);
  return data;
}

export async function updateCategory(
  id: number,
  payload: Partial<CategoryPayload>,
): Promise<Category> {
  const { data } = await api.patch(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/categories/${id}`);
}