import { api } from "./client";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  email: string;
  username: string;
  password: string;
  displayName?: string;
};

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/login", payload);
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/register", payload);
  return data;
}

export async function getMe() {
  const { data } = await api.get("/me");
  return data;
}
