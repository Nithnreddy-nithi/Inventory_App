import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const login = async (username, password) => {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await axios.post(
    `${API_URL}/auth/token`,
    form,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  return res.data;
};

export const register = async (data) => {
  const res = await axios.post(`${API_URL}/auth/register`, data);
  return res.data;
};

export const getProfile = async (token) => {
  const res = await axios.get(`${API_URL}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
