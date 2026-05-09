import api from "./axios";

export const getDashboardSummary = (filter = "week") => {
  return api.get("/admin/dashboard/summary", { params: { filter } });
};

export const getAdminBookings = (params) => {
  // params could have ?page=0&size=10&sort=createdAt,desc based on Pageable
  return api.get("/admin/bookings", { params });
};

export const getTopCustomers = () => {
  return api.get("/admin/dashboard/top-customers");
};

export const getInactiveCustomers = (days = 30, params) => {
  return api.get(`/admin/customers/inactive?days=${days}`, { params });
};

export const getProductSales = () => {
  return api.get("/admin/analytics/product-sales");
};

export const updateSalonSettings = (data) => {
  return api.put("/admin/salon-settings", data);
};
