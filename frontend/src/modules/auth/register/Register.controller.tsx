import { useState } from "react";
import { type RegisterFormDataType } from "../authSchema";
import RegisterView from "./Register.view";
import api from "../../../services/api";
import { useNavigate } from "react-router-dom";

const RegisterController = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (data: RegisterFormDataType) => {
    setIsLoading(true);
    console.log("data: ", data);
    try {
      await api.post("/auth/login", {
        name: data.name,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });

      setIsLoading(false);
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      alert("Erro no login, verifique suas credenciais.");
    }
  };

  return <RegisterView onSubmit={handleRegister} isLoading={isLoading} />;
};

export default RegisterController;
