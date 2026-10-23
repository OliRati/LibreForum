export interface User {
  id: number;
  email: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatar: string | null;
  forumRank: string | null;
  lastSeenAt: string | null;
  createdAt?: string;
  roles: string[];
  state: string[];
}
