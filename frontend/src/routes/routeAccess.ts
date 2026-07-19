import { UserRole } from "../modules/auth/enums/enumUserRole";

export type UserRoleValue = UserRole | "ADMIN" | "USER";

export const normalizeUserRole = (role: unknown): UserRole | null => {
  if (typeof role !== "string") return null;

  const normalizedRole = role.toLowerCase();
  return Object.values(UserRole).includes(normalizedRole as UserRole)
    ? (normalizedRole as UserRole)
    : null;
};

export const getHomeRouteForRole = (role: UserRole): string =>
  role === UserRole.ADMIN ? "/admin" : "/client";

const getPathname = (route: string): string => route.split(/[?#]/, 1)[0];

export const isAdminRoute = (route: string): boolean => {
  const pathname = getPathname(route);
  return pathname === "/admin" || pathname.startsWith("/admin/");
};

export const isClientRoute = (route: string): boolean => {
  const pathname = getPathname(route);
  return (
    pathname === "/client" ||
    pathname.startsWith("/client/") ||
    pathname === "/schedule/new"
  );
};

export const canRoleAccessRoute = (
  role: UserRole,
  route: string,
): boolean =>
  role === UserRole.ADMIN ? isAdminRoute(route) : isClientRoute(route);

export const getRouteAfterLogin = (
  roleValue: UserRoleValue,
  requestedRoute?: string,
): string => {
  const role = normalizeUserRole(roleValue);
  if (!role) return "/login";

  return requestedRoute && canRoleAccessRoute(role, requestedRoute)
    ? requestedRoute
    : getHomeRouteForRole(role);
};
