export interface Post {
  id: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;

  isDeleted?: boolean;
  moderationStatus?: string | null;
  toxicityScore?: number | null;

  author?: {
    id: number;
    username: string;
  };

  topic?: {
    id: number;
    title?: string;
  };
}