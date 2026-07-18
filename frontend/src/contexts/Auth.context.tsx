import { createContext } from "react";

export interface User {
  id: string;
  name: string;
  role: "admin" | "user";
}

export type AuthUser = Omit<User, "role"> & {
  role: User["role"] | "ADMIN" | "USER";
};

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: ({ userData, token }: { userData: AuthUser; token: string }) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
