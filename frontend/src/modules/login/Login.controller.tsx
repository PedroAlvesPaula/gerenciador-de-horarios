import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginContext } from './Login.context';
import LoginView from './Login.view';

const LoginController = () => {
    const { t } = useTranslation();

    // Estados dos inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Simulação do envio para o Back-end
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault(); // Evita que a página recarregue

        if (!email || !password) {
            alert("Preencha todos os campos!");
            return;
        }

        setIsLoading(true);

        // Simulando um delay de rede de 2 segundos
        setTimeout(() => {
            setIsLoading(false);
            console.log("Dados enviados:", { email, password });
            alert(`Bem-vindo, ${email}! (Back-end pendente)`);

            // Futuramente aqui terá um redirecionamento, ex: navigate('/dashboard')
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