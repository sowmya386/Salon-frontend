import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./auth/AdminLogin";
import ProtectedRoute from "./auth/ProtectedRoute";
import AdminDashboard from "./admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Protected route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
