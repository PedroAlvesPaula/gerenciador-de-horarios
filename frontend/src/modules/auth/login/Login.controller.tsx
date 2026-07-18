import { useCallback, useMemo, useState } from "react";
import LoginView from "./Login.view";
import { type LoginFormDataType } from "../authSchema";
import { notifySuccess, notifyError } from "../../../utils/toast";
import { useAuth } from "../../../contexts/useAuth";
import { authLogin, authLoginGoogle } from "../services/auth.service";
import { LoginContext } from "./Login.context";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRole } from "../enums/enumUserRole";
import { useTranslation } from "react-i18next";
import { type UserCredentials } from "../services/types/auth.types";

interface LoginLocationState {
  from?: string;
}

const LoginController = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const getRouteAfterLogin = useCallback(
    (role: UserCredentials["role"]): string => {
      const requestedRoute = (location.state as LoginLocationState | null)
        ?.from;
      const normalizedRole = role.toLowerCase();

      if (requestedRoute?.startsWith("/admin")) {
        return normalizedRole === UserRole.ADMIN ? requestedRoute : "/client";
      }

      if (requestedRoute?.startsWith("/")) return requestedRoute;

      return normalizedRole === UserRole.ADMIN ? "/admin" : "/client";
    },
    [location.state],
  );

  const handleLogin = useCallback(
    async (data: LoginFormDataType) => {
      setIsLoading(true);

      try {
        const successData = await authLogin(data);

        login({ userData: successData.user, token: successData.token });
        notifySuccess("Bem-vindo de volta!");
        navigate(getRouteAfterLogin(successData.user.role), { replace: true });
      } catch (error) {
        console.error("Erro ao realizar login:", error);
        notifyError("Falha no login: verifique seu e-mail e senha.");
      } finally {
        setIsLoading(false);
      }
    },
    [getRouteAfterLogin, login, navigate],
  );

  const handleGoogleLogin = useCallback(
    async (credential?: string) => {
      if (!credential) {
        notifyError("Login com Google cancelado ou não iniciado.");
        return;
      }

      setIsLoading(true);

      try {
        const successData = await authLoginGoogle({
          googleToken: credential,
        });

        login({ userData: successData.user, token: successData.token });
        notifySuccess("Bem-vindo de volta!");
        navigate(getRouteAfterLogin(successData.user.role), { replace: true });
      } catch (error) {
        console.error("Erro ao realizar login com Google:", error);
        notifyError("Falha ao autenticar com o Google no servidor.");
      } finally {
        setIsLoading(false);
      }
    },
    [getRouteAfterLogin, login, navigate],
  );

  const providerValues = useMemo(
    () => ({
      handleGoogleLogin,
      handleLogin,
      isLoading,
      t,
    }),
    [handleGoogleLogin, handleLogin, isLoading, t],
  );

  return (
    <LoginContext.Provider value={providerValues}>
      <LoginView />
    </LoginContext.Provider>
  );
};
export default LoginController;
