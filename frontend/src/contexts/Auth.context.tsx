import { createContext } from "react";
import { UserRole } from "../modules/auth/enums/enumUserRole";

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export type AuthUser = Omit<User, "role"> & {
  role: UserRole | "ADMIN" | "USER";
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
