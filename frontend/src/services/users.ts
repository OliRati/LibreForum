import { apiFetch } from '../lib/api';
import type { User } from '../types/user';

export async function getUsers(): Promise<User[]> {
  return apiFetch<User[]>('/api/users');
}
