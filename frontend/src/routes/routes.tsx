import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.view';
import { landingPageRoutes } from '../modules/landingPage/routes/LandingPage.routes';
import { authRoutes } from '../modules/auth/routes/Auth.routes';

const appRoutes = [
    ...landingPageRoutes,
    ...authRoutes,
];

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: appRoutes,
    }
]);