import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { Box, CircularProgress } from "@mui/material";
import { UserRole } from "../modules/auth/enums/enumUserRole";
import { notifyAccessDenied } from "../utils/toast";
import { getHomeRouteForRole } from "./routeAccess";

interface ProtectedRouteProps {
  allowedRoles?: readonly UserRole[];
}

interface AccessDeniedRedirectProps {
  message: string;
  to: string;
  from: string;
}

const AccessDeniedRedirect = ({
  message,
  to,
  from,
}: AccessDeniedRedirectProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    notifyAccessDenied(message);
    navigate(to, { replace: true, state: { from } });
  }, [from, message, navigate, to]);

  return null;
};

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const requestedRoute = `${location.pathname}${location.search}${location.hash}`;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={24} color="primary" />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <AccessDeniedRedirect
        message="Faça login para acessar esta página."
        to="/login"
        from={requestedRoute}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <AccessDeniedRedirect
        message="Você não tem permissão para acessar esta página."
        to={getHomeRouteForRole(user.role)}
        from={requestedRoute}
      />
    );
  }

  return <Outlet />;
};
