import { useState } from "react";
import LoginView from "./Login.view";
import { type LoginFormDataType } from "../authSchema";

const LoginController = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (data: LoginFormDataType) => {
    setIsLoading(true);
    console.log("Dados prontos e validados para a API de Login:", data);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return <LoginView onSubmit={handleLogin} isLoading={isLoading} />;
};

export default LoginController;
