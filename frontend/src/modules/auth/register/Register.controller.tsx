// src/modules/auth/Register.controller.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterView from './Register.view';
import { useTranslation } from 'react-i18next';

const RegisterController = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: ''
    });
    const { t } = useTranslation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            console.log("Dados de registro:", formData);
            alert("Conta criada com sucesso! (Aguardando back-end)");
            navigate('/login');
        }, 2000);
    };

    return (
        <RegisterView
            formData={formData}
            onChange={handleChange}
            onSubmit={handleRegister}
            isLoading={isLoading}
            t={t}
        />
    );
};

export default RegisterController;