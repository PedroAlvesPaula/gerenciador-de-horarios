import { createContext, useContext } from "react";
import { type TFunction } from "i18next";
import { type SubmitHandler } from "react-hook-form";
import type { LoginFormDataType } from "../authSchema";

export interface LoginContextType {
  handleGoogleLogin: (credential?: string) => Promise<void>;
  handleLogin: SubmitHandler<LoginFormDataType>;
  isLoading: boolean;
  t: TFunction<"translation", undefined>;
}

export const LoginContext = createContext<LoginContextType | undefined>(
  undefined,
);

export const useLoginContext = (): LoginContextType => {
  const context = useContext(LoginContext);

  if (!context) {
    throw new Error("useLoginContext deve ser usado dentro de LoginContext");
  }

  return context;
};
