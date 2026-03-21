import { Navigate, Outlet } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";

const ProtectedRoute = ({ children, role }) => {
  const token = getToken();
  const userRole = getRole();

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Logged in but wrong role
  if (role && userRole !== role) {
    return <Navigate to="/login" />;
  }

  // Authorized
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
