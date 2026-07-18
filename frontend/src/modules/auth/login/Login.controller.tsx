import { useMemo, useState } from "react";
import LoginView from "./Login.view";
import { type LoginFormDataType } from "../authSchema";
import { notifySuccess, notifyError } from "../../../utils/toast";
import { useAuth } from "../../../contexts/Auth.provider";
import { authLogin, authLoginGoogle } from "../services/auth.service";
import { useGoogleLogin } from "@react-oauth/google";
import { LoginContext } from "./Login.context";
import { useNavigate } from "react-router-dom";

const LoginController = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormDataType) => {
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
  };

  const notifyErrorLogin = () => {
    notifyError("Falha ao autenticar com o Google no servidor.");
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);

      await authLoginGoogle({
        googleToken: tokenResponse.access_token,
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
          console.log("successData: ", successData);
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
    onError: () => {
      notifyError("Login com Google cancelado ou falhou na origem.");
    },
  });

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
