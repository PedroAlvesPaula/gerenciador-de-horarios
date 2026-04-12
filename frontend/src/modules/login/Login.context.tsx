import { createContext, useContext } from 'react';

export interface LoginContextData {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    isLoading: boolean;
    handleLogin: (e: React.SubmitEvent) => void;
    t: any;
}

export const LoginContext = createContext<LoginContextData>({} as LoginContextData);

export const useLogin = () => useContext(LoginContext);