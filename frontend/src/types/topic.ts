export interface Topic {
  id: number;
  title: string;
  slug?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;

  isPinned?: boolean;
  isLocked?: boolean;
  isDeleted?: boolean;
  moderationStatus?: string | null;
  summary?: string | null;
  lastActivityAt?: string | null;

  author?: {
    id: number;
    username: string;
  };

  category?: {
    id: number;
    name: string;
  };

  tags?: {
    id: number;
    name: string;
  }[];

  postsCount?: number;
}
