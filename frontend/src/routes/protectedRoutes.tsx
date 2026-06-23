import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  allowedRoles?: ("admin" | "user")[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <CircularProgress size={24} color="inherit" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const fallbackRoute = user.role === "admin" ? "/admin" : "/client";
    return <Navigate to={fallbackRoute} replace />;
  }

  return <Outlet />;
};
