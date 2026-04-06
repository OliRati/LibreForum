import { api } from "./client.js";

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get("/categories");
  return data;
}