import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Styles from './Login.styles';
import { useLogin } from './Login.context';

const LoginView = () => {
    const {
        email, setEmail,
        password, setPassword,
        isLoading, handleLogin, t
    } = useLogin();

    return (
        <Styles.PageWrapper>
            <Styles.LoginCard elevation={0}>

                <Styles.HeaderContainer>
                    <Styles.BrandName variant="h4" component="h1">
                        P.H. BARBER
                    </Styles.BrandName>
                    <Styles.Subtitle>
                        Acesse sua conta para gerenciar seus horários.
                    </Styles.Subtitle>
                </Styles.HeaderContainer>

                <Styles.FormContainer onSubmit={handleLogin}>

                    <Styles.Input
                        label="E-mail"
                        variant="outlined"
                        type="email"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                    />

                    <Styles.Input
                        label="Senha"
                        variant="outlined"
                        type="password"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />

                    <Styles.SubmitButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
                    </Styles.SubmitButton>

                </Styles.FormContainer>

                <Styles.FooterContainer>
                    <Styles.TextLink>Esqueci minha senha</Styles.TextLink>
                    <Styles.TextLink>Ainda não tem conta? Cadastre-se</Styles.TextLink>
                </Styles.FooterContainer>

            </Styles.LoginCard>
        </Styles.PageWrapper>
    );
};

export default LoginView;