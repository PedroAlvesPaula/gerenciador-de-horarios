import { createContext, useContext } from 'react';

export interface AuthContextData {
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    isLoading: boolean;
    handleLogin: (e: React.SubmitEvent) => void;
    t: any;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => useContext(AuthContext);