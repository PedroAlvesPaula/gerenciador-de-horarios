import { type AppRouteObjectType } from "../../../types/route.types";

export const adminRoutes: AppRouteObjectType[] = [
  {
    lazy: async () => ({
      Component: (await import("../../../layouts/admin/AdminLayout.view"))
        .default,
    }),
    children: [
      {
        path: "/admin",
        lazy: async () => ({
          Component: (await import("../schedule/Schedule.controller")).default,
        }),
      },
      {
        path: "/admin/servicos",
        lazy: async () => ({
          Component: (await import("../catalog/Catalog.controller")).default,
        }),
      },
      {
        path: "/admin/estoque",
        lazy: async () => ({
          Component: (await import("../inventory/Inventory.controller"))
            .default,
        }),
      },
      {
        path: "/admin/perfil",
        lazy: async () => ({
          Component: (await import("../profile/Profile.controller")).default,
        }),
      },
      {
        path: "/admin/configuracoes",
        lazy: async () => ({
          Component: (
            await import(
              "../businessSettings/BusinessSettings.controller"
            )
          ).default,
        }),
      },
    ],
  },
];
