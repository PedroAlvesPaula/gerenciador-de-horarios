import axios from "axios";
import { getHomeRouteForRole, normalizeUserRole } from "../routes/routeAccess";
import { UserRole } from "../modules/auth/enums/enumUserRole";
import { API_BASE_URL } from "./apiConfig";

const api = axios.create({ baseURL: API_BASE_URL, timeout: 20_000 });

const getStoredUserRole = (): UserRole | null => {
  try {
    const storedUser = localStorage.getItem("@phbarber:user");
    return normalizeUserRole(
      storedUser ? (JSON.parse(storedUser) as { role?: unknown }).role : null,
    );
  } catch {
    return null;
  }
};

const redirectToAllowedArea = (): void => {
  try {
    const role = getStoredUserRole();
    const destination = role ? getHomeRouteForRole(role) : "/login";

    if (window.location.pathname !== destination) {
      window.location.replace(destination);
    }
  } catch {
    localStorage.removeItem("@phbarber:token");
    localStorage.removeItem("@phbarber:user");
    window.location.replace("/login");
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@phbarber:token");
  if (!token) {
    return config;
  }
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? "";
    const isAuthRequest = requestUrl.includes("/auth/");
    const method = String(error.config?.method ?? "get").toLowerCase();
    const isWriteRequest = ["post", "put", "patch", "delete"].includes(
      method,
    );
    const isAdminWriteRequest =
      isWriteRequest && getStoredUserRole() === UserRole.ADMIN;

    switch (status) {
      case 401:
        if (!isAuthRequest) {
          localStorage.removeItem("@phbarber:token");
          localStorage.removeItem("@phbarber:user");
          window.location.replace("/login");
        }
        break;

      case 403:
        redirectToAllowedArea();
        break;

      case 500:
      case 502:
      case 503:
        console.error("Erro interno do servidor. Tente novamente mais tarde.");
        if (!isAdminWriteRequest) window.location.href = "/erro-servidor";
        break;

      case 400:
      case 422:
        break;

      default:
        console.error(
          "Erro de API:",
          error.response?.data?.message || error.message,
        );
    }

    return Promise.reject(error);
  },
);

export default api;
