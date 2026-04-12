import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginContext } from './Login.context';
import LoginView from './Login.view';

const LoginController = () => {
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            console.log("Dados enviados:", { email, password });
            alert(`Bem-vindo, ${email}! (Back-end pendente)`);

        }, 2000);
    };

    return (
        <LoginContext.Provider value={{
            email, setEmail,
            password, setPassword,
            isLoading, handleLogin, t
        }}>
            <LoginView />
        </LoginContext.Provider>
    );
};

export default LoginController;