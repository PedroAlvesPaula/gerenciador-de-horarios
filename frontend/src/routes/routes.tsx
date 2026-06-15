import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.view";
import { landingPageRoutes } from "../modules/landingPage/routes/LandingPage.routes";
import { authRoutes } from "../modules/auth/routes/Auth.routes";
import { adminRoutes } from "../modules/admin/routes/admin.routes";

const publicRoutes = [...landingPageRoutes, ...authRoutes];

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: publicRoutes,
  },
  ...adminRoutes,
]);
