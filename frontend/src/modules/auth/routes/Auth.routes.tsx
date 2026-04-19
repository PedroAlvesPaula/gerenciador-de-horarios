// src/modules/auth/auth.routes.tsx
import { lazy } from 'react';
import { AppRouteObjectType } from '../../../types/route.types';

const LoginController = lazy(() => import('../login/Login.controller'));
const RegisterController = lazy(() => import('../register/Register.controller'));

export const authRoutes: AppRouteObjectType[] = [
    {
        path: "/login",
        element: <LoginController />,
        handle: { showNavBar: false, showFooter: false }
    },
    {
        path: "/signUp",
        element: <RegisterController />,
        handle: { showNavBar: false, showFooter: false }
    }
];