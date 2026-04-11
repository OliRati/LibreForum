export interface Report {
  id: number;
  reason: string;
  status: string;
  createdAt: string;

  reporter?: {
    id: number;
    username: string;
  };

  topic?: {
    id: number;
    title: string;
  } | null;

  post?: {
    id: number;
    content: string;
  } | null;
}