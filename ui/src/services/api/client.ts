import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" && localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
