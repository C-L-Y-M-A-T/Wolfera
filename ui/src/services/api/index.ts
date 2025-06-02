import apiClient from "./client";
import { request } from "./request";

const api = {
  auth: {
    login: async (username: string, password: string) => {
      return request(
        apiClient.post("/auth/login", {
          username,
          password,
        }),
      );
    },
    signup: async (email: string, username: string, password: string) => {
      return request(
        apiClient.post("/auth/signup", {
          email,
          username,
          password,
        }),
      );
    },
    logout: async () => {
      return request(apiClient.post("/auth/logout"));
    },

    profile: async (access_token: string) => {
      return request(
        apiClient.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }),
      );
    },
  },
};

export default api;
