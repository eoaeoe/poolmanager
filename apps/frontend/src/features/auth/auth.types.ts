export type UserRole = "employee" | "boss";

export type AuthUser = {
  id: string;
  name: string;
  role: UserRole;
};

export type AuthContextType = {
  user: AuthUser | null;
  loginAsEmployee: () => void;
  loginAsBoss: () => void;
  logout: () => void;
  isAuthenticated: boolean;
};
