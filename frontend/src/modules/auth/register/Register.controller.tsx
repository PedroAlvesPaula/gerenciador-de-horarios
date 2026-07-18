import { useState } from "react";
import { type RegisterFormDataType } from "../authSchema";
import RegisterView from "./Register.view";
import { useNavigate } from "react-router-dom";
import { notifyError } from "../../../utils/toast";
import { authRegister } from "../services/auth.service";

const RegisterController = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormDataType) => {
    setIsLoading(true);
    await authRegister({
      name: data.name,
      email: data.email,
      password: data.password,
      onSuccess: () => {
        setIsLoading(false);
        navigate("/login", { replace: true });
      },
      onError: (error) => {
        setIsLoading(false);
        notifyError("Erro ao criar conta. O e-mail já pode estar cadastrado.");
        console.error(error.message);
      },
    });
  };

  return <RegisterView onSubmit={handleRegister} isLoading={isLoading} />;
};

export default RegisterController;
