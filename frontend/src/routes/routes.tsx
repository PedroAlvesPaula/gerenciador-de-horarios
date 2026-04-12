import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.view';
import { landingPageRoutes } from '../modules/landingPage/routes/LandingPage.routes';
import { loginRoutes } from '../modules/login/routes/LoginRoutes';

const appRoutes = [
    ...landingPageRoutes,
    ...loginRoutes,
];

export const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: appRoutes,
    }
]);