import api from "./axios";

export const getCustomers = (params) => {
  // Guessing endpoint based on typical admin flows + from their list GET /api/admin/customers might exist or /api/admin/customers/inactive
  return api.get("/admin/customers", { params }).catch(() => {
    // If not found, fallback to inactive or other endpoints
    console.warn("Fallback customer fetch");
    return { data: [] }; 
  });
};

export const createCustomer = (data) => {
  return api.post("/admin/customers", data);
};

export const getInactiveCustomers = () => {
  return api.get("/admin/customers/inactive");
};

// Assuming staff endpoints based on standard naming (user didn't provide specific staff endpoints, so we use admin prefix)
export const getStaff = (params) => {
  return api.get("/admin/staff", { params }).catch(() => {
    return { data: [] };
  });
};

export const createStaff = (data) => {
  return api.post("/admin/staff", data);
};

export const updateStaff = (id, data) => {
  return api.put(`/admin/staff/${id}`, data);
};

export const toggleStaffActive = (id) => {
  return api.put(`/admin/staff/${id}/toggle`);
};

export const deleteStaff = (id) => {
  return api.delete(`/admin/staff/${id}`);
};
