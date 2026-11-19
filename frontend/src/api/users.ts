import { api } from "./client";

export type UserProfile = {
  id: number;
  username: string;
  displayName?: string | null;
  email?: string | null;
  bio?: string | null;
  avatar?: string | null;
  lastSeenAt?: string;
  forumRank?: string | null;
  createdAt?: string;
  postsCount?: number;
  topicsCreatedCount?: number;
  topicsParticipatedCount?: number;
  roles?: string[];
};

export type UpdateUserPayload = {
  currentPassword: string;
  displayName?: string | null;
  bio?: string | null;
  forumRank?: string | null;
  password?: string;
  avatarFile?: File | null;
};

export async function getUser(id: string | number): Promise<UserProfile> {
  const { data } = await api.get(`/users/${id}`);
  return data;
}

export async function updateUser(id: string | number, payload: UpdateUserPayload): Promise<UserProfile> {
  let body: FormData | Record<string, unknown>;

  if (payload.avatarFile) {
    const formData = new FormData();

    if (payload.displayName !== undefined) {
      formData.append('displayName', payload.displayName ?? '');
    }

    if (payload.bio !== undefined) {
      formData.append('bio', payload.bio ?? '');
    }

    if (payload.forumRank !== undefined) {
      formData.append('forumRank', payload.forumRank ?? '');
    }

    formData.append('currentPassword', payload.currentPassword);

    if (payload.password) {
      formData.append('password', payload.password);
    }

    formData.append('avatarFile', payload.avatarFile);
    body = formData;
  } else {
    body = {
      currentPassword: payload.currentPassword,
      displayName: payload.displayName,
      bio: payload.bio,
      forumRank: payload.forumRank,
      password: payload.password,
    };
  }

  const { data } = await api.patch(`/users/${id}`, body);
  return data.user ?? data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

export async function getCurrentUser(): Promise<UserProfile> {
  const { data } = await api.get("/me");
  return data;
}