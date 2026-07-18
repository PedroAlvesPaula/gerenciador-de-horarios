import { createContext } from "react";
import type { LoginFormDataType } from "../authSchema";

export interface User {
  id: string;
  name: string;
  role: "admin" | "user";
}

export interface LoginContextType {
  handleGoogleLogin: (credential?: string) => Promise<void>;
  handleLogin: (data: LoginFormDataType) => Promise<void>;
  isLoading: boolean;
}

export const LoginContext = createContext<LoginContextType>(
  {} as LoginContextType,
);
