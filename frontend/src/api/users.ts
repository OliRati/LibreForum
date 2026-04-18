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
  roles?: string[];
};

export type UpdateUserPayload = {
  displayName?: string | null;
  bio?: string | null;
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

    if (payload.password) {
      formData.append('password', payload.password);
    }

    formData.append('avatarFile', payload.avatarFile);
    body = formData;
  } else {
    body = {
      displayName: payload.displayName,
      bio: payload.bio,
      password: payload.password,
    };
  }

  const { data } = await api.patch(`/users/${id}`, body);
  return data.user ?? data;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const { data } = await api.get("/me");
  return data;
}