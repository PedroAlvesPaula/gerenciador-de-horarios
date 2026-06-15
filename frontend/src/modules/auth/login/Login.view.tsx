import CircularProgress from "@mui/material/CircularProgress";
import Styles from "../Auth.styles";
import { Link } from "react-router-dom";
import SysIcon from "../../../components/icons/SysIcon";
import { useTranslation } from "react-i18next";
import Box from "@mui/material/Box";
import SysInput from "../../../components/sysInput/SysInput";
import { FormWrapper } from "../../../components/formWrapper/FormWrapper";
import { loginSchema, type LoginFormDataType } from "../authSchema";

interface LoginViewProps {
  onSubmit: (data: LoginFormDataType) => void;
  isLoading: boolean;
}

const LoginView = ({ onSubmit, isLoading }: LoginViewProps) => {
  const { t } = useTranslation();

  return (
    <Styles.PageWrapper>
      <Styles.AuthCard>
        <Styles.ImageColumn>
          <SysIcon name="verticalLogo" width={300} height={300} />
        </Styles.ImageColumn>

        <Styles.FormColumn>
          <Styles.HeaderContainer>
            <Styles.Title variant="h4" component="h1">
              {t("login.titleLogin")}
            </Styles.Title>
            <Styles.Subtitle>{t("login.subtitleLogin")}</Styles.Subtitle>
          </Styles.HeaderContainer>

          <FormWrapper schema={loginSchema} onSubmit={onSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <SysInput
                name="email"
                label={t("login.login.email")}
                variant="outlined"
                type="email"
                fullWidth
                disabled={isLoading}
              />

              <SysInput
                name="password"
                label={t("login.login.password")}
                variant="outlined"
                type="password"
                fullWidth
                disabled={isLoading}
              />

              <Styles.SubmitButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("login.login.submitLogin")
                )}
              </Styles.SubmitButton>
            </Box>
          </FormWrapper>

          <Styles.FooterContainer>
            <Styles.TextLink component={Link} to={"/forgotPassword"}>
              {t("global.forgotPassword")}
            </Styles.TextLink>
            <Styles.TextLink component={Link} to={"/signUp"}>
              {t("global.register")}
            </Styles.TextLink>
          </Styles.FooterContainer>
        </Styles.FormColumn>
      </Styles.AuthCard>
    </Styles.PageWrapper>
  );
};

export default LoginView;
