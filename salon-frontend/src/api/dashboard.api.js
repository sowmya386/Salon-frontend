import api from "./axios";

export const getDashboardSummary = () => {
  return api.get("/admin/dashboard/summary");
};

export const getAdminBookings = (params) => {
  // params could have ?page=0&size=10&sort=createdAt,desc based on Pageable
  return api.get("/admin/bookings", { params });
};
