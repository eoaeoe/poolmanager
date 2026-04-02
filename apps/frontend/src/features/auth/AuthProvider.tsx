import { useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./auth.context";
import type { AuthContextType, AuthUser } from "./auth.types";

type Props = {
  readonly children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const loginAsEmployee = () => {
    setUser({
      id: "1",
      name: "Empleado Demo",
      role: "employee",
    });
  };

  const loginAsBoss = () => {
    setUser({
      id: "2",
      name: "Jefe Demo",
      role: "boss",
    });
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loginAsEmployee,
      loginAsBoss,
      logout,
      isAuthenticated: !!user,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
