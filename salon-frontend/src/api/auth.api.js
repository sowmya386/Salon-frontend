import axios from "axios";

// Base URL of your backend
const BASE_URL = "http://localhost:8081/api"; // Replace with your backend URL

export const adminLogin = (data) => {
  return axios.post(`${BASE_URL}/auth/admin/login`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
