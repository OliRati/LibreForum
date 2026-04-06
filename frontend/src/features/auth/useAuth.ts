import { useEffect } from "react";
import { getMe, login as loginApi, register as registerApi } from "../../api/auth";
import { useAuthStore } from "./authStore";

export function useAuth() {
  const { token, user, setToken, setUser, logout, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    async function fetchMe() {
      if (!token) return;

      try {
        const me = await getMe();
        setUser(me);
      } catch {
        logout();
      }
    }

    fetchMe();
  }, [token, setUser, logout]);

  const login = async (email: string, password: string) => {
    const data = await loginApi({ email, password });
    setToken(data.token);

    const me = await getMe();
    setUser(me);
  };

  const register = async (payload: {
    email: string;
    username: string;
    password: string;
    displayName?: string;
  }) => {
    await registerApi(payload);
  };

  return {
    token,
    user,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };
}