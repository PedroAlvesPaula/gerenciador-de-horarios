import { useCallback, useMemo, useState } from "react";
import { type RegisterFormDataType } from "../authSchema";
import RegisterView from "./Register.view";
import { useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../../utils/toast";
import { authRegister } from "../services/auth.service";
import { RegisterContext } from "./Register.context";
import { useTranslation } from "react-i18next";

const RegisterController = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = useCallback(
    async (data: RegisterFormDataType) => {
      setIsLoading(true);

      try {
        await authRegister({
          name: data.name,
          phone: data.phone,
          email: data.email,
          password: data.password,
        });

        notifySuccess("Conta criada com sucesso. Faça seu login!");
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Erro ao criar conta:", error);
        notifyError("Erro ao criar conta. O e-mail já pode estar cadastrado.");
      } finally {
        setIsLoading(false);
      }
    },
    [navigate],
  );

  const providerValue = useMemo(
    () => ({ handleRegister, isLoading, t }),
    [handleRegister, isLoading, t],
  );

  return (
    <RegisterContext.Provider value={providerValue}>
      <RegisterView />
    </RegisterContext.Provider>
  );
};

export default RegisterController;
