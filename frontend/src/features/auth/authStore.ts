import { create } from "zustand";

type User = {
  id: number;
  email: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatar?: string;
  forumRank?: string;
  roles: string[];
};

type AuthState = {
  token: string | null;
  user: User | null;
  sessionExpired: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  setSessionExpired: (expired: boolean) => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  sessionExpired: false,

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, sessionExpired: false });
  },

  setSessionExpired: (expired) => set({ sessionExpired: expired }),

  hydrate: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ token });
    }
  },
}));
