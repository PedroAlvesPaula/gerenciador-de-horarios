import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { ProtectedRoute } from "../../../routes/protectedRoutes";

const AdminLayoutView = lazy(
  () => import("../../../layouts/admin/AdminLayout.view"),
);
const ScheduleController = lazy(
  () => import("../schedule/Schedule.controller"),
);
const InventoryController = lazy(
  () => import("../inventory/Inventory.controller"),
);
const ProfileController = lazy(() => import("../profile/Profile.controller"));

const PageLoader = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    }}
  >
    <CircularProgress color="primary" />
  </Box>
);

export const adminRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <Suspense fallback={<PageLoader />}>
            <AdminLayoutView />
          </Suspense>
        ),
        children: [
          {
            path: "/admin",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ScheduleController />
              </Suspense>
            ),
          },
          {
            path: "/admin/estoque",
            element: (
              <Suspense fallback={<PageLoader />}>
                <InventoryController />
              </Suspense>
            ),
          },
          {
            path: "/admin/perfil",
            element: (
              <Suspense fallback={<PageLoader />}>
                <ProfileController />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
];
