import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress } from "@mui/material";
import Styles from "../Auth.styles";
import SysInput from "../../../components/sysInput/SysInput";
import SysIcon from "../../../components/icons/SysIcon";
import { registerSchema, type RegisterFormDataType } from "../authSchema";
import { FormWrapper } from "../../../components/formWrapper/FormWrapper";

interface RegisterViewProps {
  onSubmit: (data: RegisterFormDataType) => void;
  isLoading: boolean;
}

const RegisterView = ({ onSubmit, isLoading }: RegisterViewProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Styles.PageWrapper>
      <Styles.AuthCard>
        <Styles.ImageColumn>
          <SysIcon name="verticalLogo" />
        </Styles.ImageColumn>

        <Styles.FormColumn>
          <Styles.HeaderContainer>
            <Styles.Title variant="h4" component="h1">
              {t("login.titleRegister")}
            </Styles.Title>
            <Styles.Subtitle>{t("login.subtitleRegister")}</Styles.Subtitle>
          </Styles.HeaderContainer>

          <FormWrapper schema={registerSchema} onSubmit={onSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <SysInput
                name="name"
                label={t("login.register.name")}
                fullWidth
                disabled={isLoading}
              />

              <SysInput
                name="phone"
                label={t("login.register.phone")}
                fullWidth
                disabled={isLoading}
              />

              <SysInput
                name="email"
                label={t("register.email")}
                type="email"
                fullWidth
                disabled={isLoading}
              />

              <SysInput
                name="password"
                label={t("login.register.password")}
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
                  t("login.register.submitRegister")
                )}
              </Styles.SubmitButton>
            </Box>
          </FormWrapper>

          <Styles.FooterContainer>
            <Styles.TextLink onClick={() => navigate("/login")}>
              {t("login.hasAccount")}
            </Styles.TextLink>
          </Styles.FooterContainer>
        </Styles.FormColumn>
      </Styles.AuthCard>
    </Styles.PageWrapper>
  );
};

export default RegisterView;
