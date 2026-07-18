import { useContext, useMemo, useState, type ReactNode } from "react";
import {
  AuthContext,
  type AuthContextType,
  type AuthUser,
  type User,
} from "./Auth.context";
import { notifyError } from "../utils/toast";

const normalizeUser = (user: AuthUser): User => ({
  ...user,
  role: user.role.toLowerCase() as User["role"],
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("@phbarber:user");
    if (storedUser) {
      try {
        return normalizeUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        localStorage.removeItem("@phbarber:user");
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  const login = ({
    userData,
    token,
  }: {
    userData: AuthUser;
    token: string;
  }): void => {
    if (!userData) return notifyError("Falha ao realizar login.");

    const normalizedUser = normalizeUser(userData);

    setUser(normalizedUser);
    localStorage.setItem("@phbarber:token", token);
    localStorage.setItem("@phbarber:user", JSON.stringify(normalizedUser));

    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("@phbarber:token");
    localStorage.removeItem("@phbarber:user");
  };

  const providerValue: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext<AuthContextType>(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};
