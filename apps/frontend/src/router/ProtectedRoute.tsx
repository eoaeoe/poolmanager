import { Navigate, Outlet } from "react-router-dom";
import { ProgressSpinner } from "primereact/progressspinner";
import { useAuth } from "../features/auth/useAuth";
import type { UserRole } from "../features/auth/auth.types";

type Props = Readonly<{
  allowedRoles?: UserRole[];
}>;

export function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, isBootstrapping, user } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/404" replace />; // o "/"
  }

  return <Outlet />;
}
