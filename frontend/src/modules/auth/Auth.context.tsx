import { createContext, useContext, type SubmitEvent } from "react";
import { type TFunction } from "i18next";

export interface AuthContextData {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  isLoading: boolean;
  handleLogin: (e: SubmitEvent) => void;
  t: TFunction<"translation", undefined>;
}

export const AuthContextModule = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const useAuthContextModule = () => useContext(AuthContextModule);
