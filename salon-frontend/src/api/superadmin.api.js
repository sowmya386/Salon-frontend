import api from "./axios";

export const getPendingSalons = () => api.get('/super-admin/salons/pending');
export const approveSalon = (id) => api.put(`/super-admin/salons/${id}/approve`);
export const rejectSalon = (id) => api.put(`/super-admin/salons/${id}/reject`);
