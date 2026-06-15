import { lazy, Suspense } from "react";
import { type RouteObject } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ProtectedRoute from "../../../routes/protectedRoutes";

const AdminLayoutView = lazy(
  () => import("../../../layouts/admin/AdminLayout.view"),
);
const ScheduleController = lazy(
  () => import("../schedule/Schedule.controller"),
);

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
            element: <div>Controle da Maleta (Em breve)</div>,
          },
          {
            path: "/admin/perfil",
            element: <div>Perfil do Barbeiro (Em breve)</div>,
          },
        ],
      },
    ],
  },
];
