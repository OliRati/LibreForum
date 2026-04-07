import { api } from "./client";

export type UserProfile = {
  id: number;
  username: string;
  displayName?: string | null;
  email?: string | null;
  bio?: string | null;
  avatar?: string | null;
  forumRank?: string | null;
  createdAt?: string;
  roles?: string[];
};

export async function getUser(id: string | number): Promise<UserProfile> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const { data } = await api.get("/me");
  return data;
}