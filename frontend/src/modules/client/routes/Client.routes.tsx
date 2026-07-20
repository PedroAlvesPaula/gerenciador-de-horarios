import { type AppRouteObjectType } from "../../../types/route.types";

export const clientRoutes: AppRouteObjectType[] = [
  {
    lazy: async () => ({
      Component: (await import("../../../layouts/client/ClientLayout.view"))
        .default,
    }),
    children: [
      {
        path: "/client",
        lazy: async () => ({
          Component: (await import("../pages/dashboard/Dashboard.controller"))
            .default,
        }),
        handle: {
          showNavBar: true,
          showFooter: false,
          toolBarVariant: "client",
        },
      },
      {
        path: "/schedule/new",
        lazy: async () => ({
          Component: (await import("../pages/schedule/Schedule.controller"))
            .default,
        }),
        handle: {
          showNavBar: true,
          showFooter: false,
          toolBarVariant: "client",
        },
      },
      {
        path: "/client/enderecos",
        lazy: async () => ({
          Component: (await import("../pages/addresses/Addresses.controller"))
            .default,
        }),
        handle: {
          showNavBar: true,
          showFooter: false,
          toolBarVariant: "client",
        },
      },
    ],
  },
];
