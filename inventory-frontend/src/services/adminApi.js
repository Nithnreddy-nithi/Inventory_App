import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const fetchUsers = (token) =>
  axios.get(`${API}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUserRole = (id, role, token) =>
  axios.put(
    `${API}/admin/users/${id}/role`,
    null,
    {
      params: { role },
      headers: { Authorization: `Bearer ${token}` },
    }
  );

export const deleteUser = (id, token) =>
  axios.delete(`${API}/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
