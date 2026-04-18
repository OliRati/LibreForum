import axios from "axios";
import { useAuthStore } from "../features/auth/authStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      const authStore = useAuthStore.getState();
      if (authStore.token) {
        // Seulement si on était connecté
        authStore.logout();
        authStore.setSessionExpired(true);
      }
    }
    return Promise.reject(error);
  }
);
