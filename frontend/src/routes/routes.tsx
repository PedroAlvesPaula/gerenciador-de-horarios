import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout.view";
import { landingPageRoutes } from "../modules/landingPage/routes/LandingPage.routes";
import { authRoutes } from "../modules/auth/routes/Auth.routes";
import { adminRoutes } from "../modules/admin/routes/admin.routes";
import { clientRoutes } from "../modules/client/routes/Client.routes";
import { ProtectedRoute } from "./protectedRoutes";
import { UserRole } from "../modules/auth/enums/enumUserRole";
import RouteHydrateFallback from "../components/routing/RouteHydrateFallback";

const publicRoutes = [...landingPageRoutes, ...authRoutes];

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    hydrateFallbackElement: <RouteHydrateFallback />,
    children: publicRoutes,
  },
  {
    element: <ProtectedRoute allowedRoles={[UserRole.USER]} />,
    hydrateFallbackElement: <RouteHydrateFallback />,
    children: [
      {
        element: <MainLayout />,
        children: clientRoutes,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={[UserRole.ADMIN]} />,
    hydrateFallbackElement: <RouteHydrateFallback />,
    children: adminRoutes,
  },
]);
