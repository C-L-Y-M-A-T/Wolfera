import axios from "axios";

const api_url = process.env.API_BASE_URL;

const apiClient = axios.create({
  baseURL: api_url,
  withCredentials: true,
});

export default apiClient;
