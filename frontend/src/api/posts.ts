import { api } from "./client";

export type Post = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt?: string | null;
  isDeleted?: boolean;
  moderationStatus?: string | null;
  toxicityScore?: number | null;
  author: {
    id: number;
    username: string;
    displayName?: string;
    avatar?: string | null;
    lastSeenAt?: string;
  };
  topic?: {
    id: number;
    title?: string;
  };
};