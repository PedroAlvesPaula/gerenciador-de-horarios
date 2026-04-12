import React, { lazy } from 'react';
import { AppRouteObjectType } from '../../../types/route.types';

const LoginController = lazy(() => import('../Login.controller'));

export const loginRoutes: AppRouteObjectType[] = [
    {
        path: "/login",
        element: <LoginController />,
        handle: {
            showNavBar: false,
            showFooter: false
        }
    }
];