import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./auth.context";
import type { AuthContextType, AuthUser } from "./auth.types";
import { api } from "../../services/api";
import { clearAccessToken, setAccessToken } from "../../services/auth.token";

type Props = Readonly<{
  children: ReactNode;
}>;

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });

    setAccessToken(response.data.accessToken);
    setUser(response.data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  const bootstrapAuth = async () => {
    try {
      const refreshResponse = await api.post("/auth/refresh");
      setAccessToken(refreshResponse.data.accessToken);

      const meResponse = await api.get("/auth/me");
      setUser(meResponse.data.user);
    } catch {
      clearAccessToken();
      setUser(null);
    } finally {
      setIsBootstrapping(false);
    }
  };

  useEffect(() => {
    void bootstrapAuth();
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isBootstrapping,
      login,
      logout,
    }),
    [user, isBootstrapping],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
