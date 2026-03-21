import api from "./axios";

export const getInvoices = (params) => {
  return api.get("/admin/invoices", { params });
};

export const createInvoice = (data) => {
  return api.post("/admin/invoices", data);
};

export const markInvoicePaid = (id) => {
  // Guessing endpoint based on typical patterns
  return api.put(`/admin/invoices/${id}/pay`);
};
