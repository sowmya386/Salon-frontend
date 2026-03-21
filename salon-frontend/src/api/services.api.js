import api from "./axios";

export const getServices = (params) => {
  // Using the customer endpoint to fetch services (might be public)
  return api.get("/customers/services", { params });
};

export const createService = (data) => {
  return api.post("/admin/services", data);
};

export const updateService = (id, data) => {
  return api.put(`/admin/services/${id}`, data); // Guessing endpoint
};

export const deleteService = (id) => {
  return api.delete(`/admin/services/${id}`); // Guessing endpoint
};
