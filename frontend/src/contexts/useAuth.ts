import { useContext } from "react";
import { AuthContext, type AuthContextType } from "./Auth.context";

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
