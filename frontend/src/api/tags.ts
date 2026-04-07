import { api } from "./client";

export type Tag = {
  id: number;
  name: string;
  slug: string;
};

export async function getTags(): Promise<Tag[]> {
  const { data } = await api.get("/tags");
  return data;
}