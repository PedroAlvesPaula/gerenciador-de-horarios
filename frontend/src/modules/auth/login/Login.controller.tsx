import { useState } from "react";
import LoginView from "./Login.view";
import { type LoginFormDataType } from "../authSchema";
import api from "../../../services/api";
import { notifySuccess, notifyError } from "../../../utils/toast";
import { useAuth } from "../../../contexts/AuthContext";

const LoginController = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (data: LoginFormDataType) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { access_token, user } = response.data;

      login({ userData: user, token: access_token });

      setIsLoading(false);
      notifySuccess("Bem-vindo de volta!");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        notifyError("Falha no login: verifique seu e-mail e senha.");
      }
    }
  };

  return <LoginView onSubmit={handleLogin} isLoading={isLoading} />;
};

export default LoginController;
