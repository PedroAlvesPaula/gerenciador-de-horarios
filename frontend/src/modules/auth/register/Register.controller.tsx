import { useState } from "react";
import { type RegisterFormDataType } from "../authSchema";
import RegisterView from "./Register.view";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { notifyError } from "../../../utils/toast";

const RegisterController = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormDataType) => {
    setIsLoading(true);
    try {
      await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      notifyError("Erro ao tentar criar o usuário, tente novamente.");
    }
  };

  return <RegisterView onSubmit={handleRegister} isLoading={isLoading} />;
};

export default RegisterController;
