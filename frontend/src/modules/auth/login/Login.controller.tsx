import { useCallback, useMemo, useState } from "react";
import LoginView from "./Login.view";
import { type LoginFormDataType } from "../authSchema";
import { notifySuccess, notifyError } from "../../../utils/toast";
import { useAuth } from "../../../contexts/useAuth";
import { authLogin, authLoginGoogle } from "../services/auth.service";
import { LoginContext } from "./Login.context";
import { useNavigate } from "react-router-dom";

const LoginController = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = useCallback(
    async (data: LoginFormDataType) => {
      setIsLoading(true);

      await authLogin({
        email: data.email,
        password: data.password,
        callback: (error, successData) => {
          setIsLoading(false);
          if (error) {
            notifyError("Falha no login: verifique seu e-mail e senha.");
            console.error(error.message);
            return;
          }
          if (successData) {
            login({ userData: successData.user, token: successData.token });
            navigate("/client");
            notifySuccess("Bem-vindo de volta!");
          }
        },
      });
    },
    [login, navigate],
  );

  const notifyErrorLogin = () => {
    notifyError("Falha ao autenticar com o Google no servidor.");
  };

  const handleGoogleLogin = useCallback(
    async (credential?: string) => {
      if (!credential) {
        notifyError("Login com Google cancelado ou não iniciado.");
        return;
      }

      setIsLoading(true);

      await authLoginGoogle({
        googleToken: credential,
        onSuccess: (successData) => {
          setIsLoading(false);
          if (!successData?.user) {
            notifyErrorLogin();
            return;
          }
          if (!successData?.token) {
            notifyErrorLogin();
            return;
          }
          notifySuccess("Bem-vindo de volta!");
          login({ userData: successData.user, token: successData.token });
          if (successData.user.role.toLowerCase() === "admin") {
            navigate("/admin");
          } else {
            navigate("/client");
          }
        },
        onError: (error) => {
          setIsLoading(false);
          console.error("Erro na API:", error);
          notifyError("Falha ao autenticar com o Google no servidor.");
        },
      });
    },
    [login, navigate],
  );

  const providerValues = useMemo(
    () => ({
      handleGoogleLogin,
      handleLogin,
      isLoading,
    }),
    [handleGoogleLogin, handleLogin, isLoading],
  );

  return (
    <LoginContext.Provider value={providerValues}>
      <LoginView />
    </LoginContext.Provider>
  );
};
export default LoginController;
