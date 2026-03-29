import api from "./axios";

export const getBookings = (params) => {
  return api.get("/admin/bookings", { params });
};

export const createBooking = (data) => {
  return api.post("/admin/bookings", data); // Guessing endpoint for admins creating bookings
};

export const completeBooking = (bookingId) => {
  return api.put(`/admin/bookings/${bookingId}/complete`);
};

export const cancelBooking = (bookingId, payload) => {
  return api.put(`/admin/bookings/${bookingId}/cancel`, payload);
};
