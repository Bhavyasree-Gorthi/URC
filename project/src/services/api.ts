import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const baseURL = rawBaseUrl.replace(/\/+$/, "");

const API = axios.create({
  baseURL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
