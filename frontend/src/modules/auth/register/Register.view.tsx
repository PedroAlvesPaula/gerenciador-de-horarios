import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import Styles from "../Auth.styles";
import SysInput from "../../../components/sysInput/SysInput";
import { registerSchema, type RegisterFormDataType } from "../authSchema";
import { FormWrapper } from "../../../components/formWrapper/FormWrapper";
import AuthPageLayout from "../components/AuthPageLayout";
import AuthSubmitButton from "../components/AuthSubmitButton";
import { useRegisterContext } from "./Register.context";

const registerDefaultValues: RegisterFormDataType = {
  name: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterView = () => {
  const { handleRegister, isLoading, t } = useRegisterContext();

  return (
    <AuthPageLayout
      title={t("login.titleRegister")}
      subtitle={t("login.subtitleRegister")}
      footer={
        <Styles.TextLink component={Link} to="/login">
          {t("login.hasAccount")}
        </Styles.TextLink>
      }
    >
      <FormWrapper
        schema={registerSchema}
        onSubmit={handleRegister}
        defaultValues={registerDefaultValues}
      >
        {({ register, formState: { errors, isSubmitting } }) => (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <SysInput
              registration={register("name")}
              errorMessage={errors.name?.message}
              label={t("login.register.name")}
              autoComplete="name"
              autoFocus
              required
              fullWidth
              disabled={isLoading}
            />

            <SysInput
              registration={register("phone")}
              errorMessage={errors.phone?.message}
              label={t("login.register.phone")}
              autoComplete="tel"
              type="tel"
              required
              slotProps={{ htmlInput: { inputMode: "numeric" } }}
              fullWidth
              disabled={isLoading}
            />

            <SysInput
              registration={register("email")}
              errorMessage={errors.email?.message}
              label={t("login.register.email")}
              autoComplete="email"
              type="email"
              required
              fullWidth
              disabled={isLoading}
            />

            <SysInput
              registration={register("password")}
              errorMessage={errors.password?.message}
              label={t("login.register.password")}
              autoComplete="new-password"
              type="password"
              required
              fullWidth
              disabled={isLoading}
            />

            <SysInput
              registration={register("confirmPassword")}
              errorMessage={errors.confirmPassword?.message}
              label={t("login.register.confirmPassword")}
              autoComplete="new-password"
              type="password"
              required
              disabled={isLoading}
              fullWidth
            />

            <AuthSubmitButton
              isLoading={isLoading || isSubmitting}
              label={t("login.register.submitRegister")}
            />
          </Box>
        )}
      </FormWrapper>
    </AuthPageLayout>
  );
};

export default RegisterView;
