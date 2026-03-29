import { Navigate, Outlet } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";

const RoleRoute = () => {
  const token = getToken();
  const role = getRole();

  if (token) {
    if (role === "SUPER_ADMIN") return <Navigate to="/super-admin/dashboard" replace />;
    if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (role === "STAFF") return <Navigate to="/staff/dashboard" replace />;
    if (role === "CUSTOMER") return <Navigate to="/portal/home" replace />;
  }

  // Not logged in -> render child (e.g. Login page)
  return <Outlet />;
};

export default RoleRoute;
