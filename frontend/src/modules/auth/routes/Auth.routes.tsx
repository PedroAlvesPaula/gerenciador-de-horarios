import { type AppRouteObjectType } from "../../../types/route.types";

export const authRoutes: AppRouteObjectType[] = [
  {
    path: "/login",
    lazy: async () => ({
      Component: (await import("../login/Login.controller")).default,
    }),
    handle: { showNavBar: false, showFooter: false },
  },
  {
    path: "/signUp",
    lazy: async () => ({
      Component: (await import("../register/Register.controller")).default,
    }),
    handle: { showNavBar: false, showFooter: false },
  },
];
