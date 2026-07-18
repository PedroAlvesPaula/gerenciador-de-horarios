import { type AppRouteObjectType } from "../../../types/route.types";

export const landingPageRoutes: AppRouteObjectType[] = [
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("../LandingPage.controller")).default,
    }),
    handle: {
      showNavBar: true,
      showFooter: true,
    },
  },
];
