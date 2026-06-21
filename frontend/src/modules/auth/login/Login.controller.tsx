import { useState } from "react";
import LoginView from "./Login.view";
import { type LoginFormDataType } from "../authSchema";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

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
      navigate("/admin");
    } catch (error) {
      setIsLoading(false);
      alert("Erro no login, verifique suas credenciais.");
    }
  };

  return <LoginView onSubmit={handleLogin} isLoading={isLoading} />;
};

export default LoginController;
