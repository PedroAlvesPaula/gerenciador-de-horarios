import { lazy } from "react";
import { type AppRouteObjectType } from "../../../types/route.types";

const DashboardController = lazy(
  () => import("../pages/dashboard/Dashboard.controller"),
);
const ScheduleController = lazy(
  () => import("../pages/schedule/Schedule.controller"),
);

export const clientRoutes: AppRouteObjectType[] = [
  {
    path: "/client",
    element: <DashboardController />,
    handle: { showNavBar: false, showFooter: false },
  },
  {
    path: "/schedule/new",
    element: <ScheduleController />,
    handle: { showNavBar: false, showFooter: false },
  },
];
