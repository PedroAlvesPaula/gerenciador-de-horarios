import { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  AuthContext,
  type AuthContextType,
  type AuthUser,
  type User,
} from "./Auth.context";
import { notifyError } from "../utils/toast";
import { normalizeUserRole } from "../routes/routeAccess";

const normalizeUser = (user: unknown): User | null => {
  if (!user || typeof user !== "object") return null;

  const candidate = user as Partial<AuthUser>;
  const normalizedRole = normalizeUserRole(candidate.role);

  if (
    typeof candidate.id !== "string" ||
    typeof candidate.name !== "string" ||
    !normalizedRole
  ) {
    return null;
  }

  return {
    id: candidate.id,
    name: candidate.name,
    role: normalizedRole,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("@phbarber:user");
    const storedToken = localStorage.getItem("@phbarber:token");

    if (storedUser && storedToken) {
      try {
        const normalizedUser = normalizeUser(JSON.parse(storedUser));

        if (normalizedUser) return normalizedUser;
      } catch {
        // A sessão inválida é removida abaixo.
      }
    }

    localStorage.removeItem("@phbarber:user");
    localStorage.removeItem("@phbarber:token");
    return null;
  });

  const [loading, setLoading] = useState(false);

  const login = useCallback(
    ({
      userData,
      token,
    }: {
      userData: AuthUser;
      token: string;
    }): void => {
      const normalizedUser = normalizeUser(userData);

      if (!normalizedUser || !token) {
        notifyError("Falha ao realizar login.");
        return;
      }

      setUser(normalizedUser);
      localStorage.setItem("@phbarber:token", token);
      localStorage.setItem("@phbarber:user", JSON.stringify(normalizedUser));

      setLoading(false);
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("@phbarber:token");
    localStorage.removeItem("@phbarber:user");
  }, []);

  const providerValue: AuthContextType = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout],
  );

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};
