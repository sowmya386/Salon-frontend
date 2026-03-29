import api from "./axios";

// Admin Auth
export const unifiedLogin = (data) => api.post(`/auth/login`, data);
export const adminLogin = (data) => api.post(`/auth/admin/login`, data);
export const adminRegister = (data) => api.post(`/auth/admin/register`, data);

// Customer Auth
export const customerLogin = (data) => api.post(`/auth/customers/login`, data);
export const customerRegister = (data) => api.post(`/auth/customers/register`, data);

// Password recovery (placeholders)
export const forgotPassword = (data) => api.post(`/auth/forgot-password`, data);
export const resetPassword = (data) => api.post(`/auth/reset-password`, data);

export const getApprovedSalons = () => api.get('/salons');
