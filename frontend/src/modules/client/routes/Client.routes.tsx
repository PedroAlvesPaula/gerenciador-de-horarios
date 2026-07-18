import { type AppRouteObjectType } from "../../../types/route.types";

export const clientRoutes: AppRouteObjectType[] = [
  {
    path: "/client",
    lazy: async () => ({
      Component: (await import("../pages/dashboard/Dashboard.controller"))
        .default,
    }),
    handle: { showNavBar: false, showFooter: false },
  },
  {
    path: "/schedule/new",
    lazy: async () => ({
      Component: (await import("../pages/schedule/Schedule.controller"))
        .default,
    }),
    handle: { showNavBar: false, showFooter: false },
  },
];
