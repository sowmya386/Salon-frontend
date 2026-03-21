import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import AuthLayout from "./pages/auth/AuthLayout";
import CustomerLayout from "./layouts/CustomerLayout";

// Pages
import AdminDashboard from "./admin/Dashboard";
import ServicesList from "./admin/ServicesList";
import ProductsList from "./admin/ProductsList";
import BookingsList from "./admin/BookingsList";
import BillingList from "./admin/BillingList";
import CustomersList from "./admin/CustomersList";
import StaffList from "./admin/StaffList";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/customer/Home";
import PublicServices from "./pages/customer/Services";
import PublicProducts from "./pages/customer/Products";
import Profile from "./pages/customer/Profile";
import BookAppointment from "./pages/customer/BookAppointment";
import SuperAdminDashboard from "./admin/SuperAdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public / Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<PublicServices />} />
          <Route path="/products" element={<PublicProducts />} />
        </Route>

        {/* Customer Protected routes */}
        <Route path="/portal" element={<ProtectedRoute role="CUSTOMER" />}>
          <Route element={<CustomerLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="book" element={<BookAppointment />} />
          </Route>
        </Route>

        {/* Public auth routes with split-screen layout */}
        <Route element={<RoleRoute />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Route>

        {/* Admin protected routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="services" element={<ServicesList />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="bookings" element={<BookingsList />} />
          <Route path="billing" element={<BillingList />} />
          <Route path="customers" element={<CustomersList />} />
          <Route path="staff" element={<StaffList />} />
        </Route>

        {/* Super Admin protected routes */}
        <Route
          path="/super-admin"
          element={
            <ProtectedRoute role="SUPER_ADMIN">
              <AdminLayout isSuperAdmin={true} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuperAdminDashboard />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
