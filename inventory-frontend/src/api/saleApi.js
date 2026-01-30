import axios from "axios";

const API = "http://127.0.0.1:8000";

export const createSale = (data, token) =>
  axios.post(`${API}/sales/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSales = (token) =>
  axios.get(`${API}/sales/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getSale = (id, token) =>
  axios.get(`${API}/sales/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteSale = (id, token) =>
  axios.delete(`${API}/sales/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
