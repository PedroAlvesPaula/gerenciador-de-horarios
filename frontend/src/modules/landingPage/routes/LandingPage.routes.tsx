// src/modules/landingPage/landingPage.routes.tsx
import { lazy } from "react";
import { type AppRouteObjectType } from "../../../types/route.types";

const LandingPageController = lazy(() => import("../LandingPage.controller"));

export const landingPageRoutes: AppRouteObjectType[] = [
  {
    path: "/",
    element: <LandingPageController />,
    handle: {
      showNavBar: true,
      showFooter: true,
    },
  },
];
