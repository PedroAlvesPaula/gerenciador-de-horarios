import { useState } from "react";
import LoginView from "./Login.view";
import { type LoginFormDataType } from "../authSchema";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../../utils/toast";

const LoginController = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (data: LoginFormDataType) => {
    setIsLoading(true);
    console.log("data: ", data);
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      const { access_token, user } = response.data;

      localStorage.setItem("@phbarber:token", access_token);
      localStorage.setItem("@phbarber:user", JSON.stringify(user));

      setIsLoading(false);
      notifySuccess("Bem-vindo de volta!");
      navigate("/admin");
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
