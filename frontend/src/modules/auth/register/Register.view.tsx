// src/modules/auth/Register.view.tsx
import React from 'react';
import { CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Styles from '../Auth.styles';
import SysIcon from '../../../components/icons/SysIcon';

interface RegisterViewProps {
    formData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.SubmitEvent) => void;
    isLoading: boolean;
    t: any;
}

const RegisterView = ({ formData, onChange, onSubmit, isLoading, t }: RegisterViewProps) => {
    return (
        <Styles.PageWrapper>
            <Styles.AuthCard>
                <Styles.ImageColumn>
                    <SysIcon
                        name="verticalLogo"
                        width={300}
                        height={300}
                    />
                </Styles.ImageColumn>

                <Styles.FormColumn>
                    <Styles.HeaderContainer>
                        <Styles.Title variant="h4">{t('login.titleRegister')}</Styles.Title>
                        <Styles.Subtitle>{t('login.subtitleRegister')}</Styles.Subtitle>
                    </Styles.HeaderContainer>

                    <Styles.FormContainer onSubmit={onSubmit}>
                        <Styles.Input
                            label="Nome Completo"
                            name="name"
                            fullWidth required
                            value={formData.name}
                            onChange={onChange}
                            disabled={isLoading}
                        />

                        <Styles.Input
                            label="Celular"
                            name="phone"
                            placeholder="(31) 99999-9999"
                            fullWidth required
                            value={formData.phone}
                            onChange={onChange}
                            disabled={isLoading}
                        />

                        <Styles.Input
                            label="E-mail"
                            name="email"
                            type="email"
                            fullWidth required
                            value={formData.email}
                            onChange={onChange}
                            disabled={isLoading}
                        />

                        <Styles.Input
                            label="Senha"
                            name="password"
                            type="password"
                            fullWidth required
                            value={formData.password}
                            onChange={onChange}
                            disabled={isLoading}
                        />

                        <Styles.SubmitButton
                            type="submit"
                            variant="contained"
                            fullWidth
                            disabled={isLoading}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Cadastrar"}
                        </Styles.SubmitButton>
                    </Styles.FormContainer>

                    <Styles.FooterContainer>
                        <Styles.TextLink component={RouterLink} to="/login">
                            {t("global.login")}
                        </Styles.TextLink>
                    </Styles.FooterContainer>
                </Styles.FormColumn>
            </Styles.AuthCard>
        </Styles.PageWrapper>
    );
};

export default RegisterView;