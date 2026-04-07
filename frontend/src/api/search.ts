import { api } from "./client";
import type { Topic } from "./topics";

export async function searchTopics(query: string): Promise<Topic[]> {
  const { data } = await api.get(`/topics?search=${encodeURIComponent(query)}`);
  return data;
}