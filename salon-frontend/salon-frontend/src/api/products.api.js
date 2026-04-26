import api from "./axios";

export const getProducts = (params) => {
  // Assuming this is public/customer facing for fetching all products
  return api.get("/customers/products", { params });
};

export const createProduct = (data) => {
  return api.post("/admin/products", data);
};

export const updateProduct = (id, data) => {
  return api.put(`/admin/products/${id}`, data); // Guessing endpoint for edits
};

export const deleteProduct = (id) => {
  return api.delete(`/admin/products/${id}`); // Guessing endpoint for deletes
};
