// src/modules/landingPage/landingPage.routes.tsx
import React, { lazy } from 'react';
import { AppRouteObjectType } from '../../../types/route.types';

const LandingPageController = lazy(() => import('../LandingPage.controller'));

export const landingPageRoutes: AppRouteObjectType[] = [
    {
        path: "/",
        element: <LandingPageController />,
        handle: {
            showNavBar: true,
            showFooter: true
        }
    }
];