// src/modules/login/Login.view.tsx
import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Styles from '../Auth.styles';
import { useAuth } from '../Auth.context';
import { Link } from 'react-router-dom';
import SysIcon from '../../../components/icons/SysIcon';

const LoginView = () => {
    const {
        email, setEmail,
        password, setPassword,
        isLoading, handleLogin, t
    } = useAuth();

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
                        <Styles.Title variant="h4" component="h1">
                            {t('login.titleLogin')}
                        </Styles.Title>
                        <Styles.Subtitle>
                            {t('login.subtitleLogin')}
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
                        <Styles.TextLink component={Link} to={"/forgotPassword"}>
                            {t('global.forgotPassword')}
                        </Styles.TextLink>
                        <Styles.TextLink component={Link} to={"/signUp"}>
                            {t('global.register')}
                        </Styles.TextLink>
                    </Styles.FooterContainer>
                </Styles.FormColumn>

            </Styles.AuthCard>
        </Styles.PageWrapper>
    );
};

export default LoginView;