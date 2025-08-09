import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

export default function RequireAuth({ allowedRoles }) {
  const location = useLocation();
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="p-4">Đang tải...</div>;
  }

  if (!user) {
    // Chưa login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Sai quyền
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
