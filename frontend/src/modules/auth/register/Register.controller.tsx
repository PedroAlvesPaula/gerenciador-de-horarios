import { useState } from "react";
import { type RegisterFormDataType } from "../authSchema";
import RegisterView from "./Register.view";

const RegisterController = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (data: RegisterFormDataType) => {
    setIsLoading(true);
    console.log("Dados perfeitamente validados e prontos para a API:", data);

    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return <RegisterView onSubmit={handleRegister} isLoading={isLoading} />;
};

export default RegisterController;
