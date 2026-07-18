import { createContext, useContext } from "react";
import { type TFunction } from "i18next";
import { type SubmitHandler } from "react-hook-form";
import { type RegisterFormDataType } from "../authSchema";

export interface RegisterContextType {
  handleRegister: SubmitHandler<RegisterFormDataType>;
  isLoading: boolean;
  t: TFunction<"translation", undefined>;
}

export const RegisterContext = createContext<
  RegisterContextType | undefined
>(undefined);

export const useRegisterContext = (): RegisterContextType => {
  const context = useContext(RegisterContext);

  if (!context) {
    throw new Error(
      "useRegisterContext deve ser usado dentro de RegisterContext",
    );
  }

  return context;
};
