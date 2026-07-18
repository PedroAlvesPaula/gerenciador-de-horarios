import CircularProgress from "@mui/material/CircularProgress";
import Styles from "../Auth.styles";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import SysInput from "../../../components/sysInput/SysInput";
import { FormWrapper } from "../../../components/formWrapper/FormWrapper";
import { loginSchema, type LoginFormDataType } from "../authSchema";
import { useLoginContext } from "./Login.context";
import AuthPageLayout from "../components/AuthPageLayout";
import AuthSubmitButton from "../components/AuthSubmitButton";
import GoogleCredentialButton from "../components/GoogleCredentialButton";

const loginDefaultValues: LoginFormDataType = {
  email: "",
  password: "",
};

const LoginView = () => {
  const { handleGoogleLogin, handleLogin, isLoading, t } = useLoginContext();

  return (
    <AuthPageLayout
      title={t("login.titleLogin")}
      subtitle={t("login.subtitleLogin")}
      footer={
        <Styles.TextLink component={Link} to="/signUp">
          {t("global.register")}
        </Styles.TextLink>
      }
    >
      <FormWrapper
        schema={loginSchema}
        onSubmit={handleLogin}
        defaultValues={loginDefaultValues}
      >
        {({ register, formState: { errors, isSubmitting } }) => (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <SysInput
              registration={register("email")}
              errorMessage={errors.email?.message}
              label={t("login.login.email")}
              autoComplete="email"
              autoFocus
              variant="outlined"
              type="email"
              required
              fullWidth
              disabled={isLoading}
            />

            <SysInput
              registration={register("password")}
              errorMessage={errors.password?.message}
              label={t("login.login.password")}
              autoComplete="current-password"
              variant="outlined"
              type="password"
              required
              fullWidth
              disabled={isLoading}
            />

            <AuthSubmitButton
              isLoading={isLoading || isSubmitting}
              label={t("login.login.submitLogin")}
            />
          </Box>
        )}
      </FormWrapper>

      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "center",
          opacity: isLoading ? 0.6 : 1,
          pointerEvents: isLoading ? "none" : "auto",
        }}
      >
        {isLoading ? (
          <CircularProgress size={24} />
        ) : (
          <GoogleCredentialButton
            onSuccess={handleGoogleLogin}
            onError={handleGoogleLogin}
          />
        )}
      </Box>
    </AuthPageLayout>
  );
};

export default LoginView;
