import apiClient from "./client";

const api = {
  auth: {
    login: async (email: string, password: string) => {
      const data = await apiClient.post("/auth/login", {
        email,
        password,
      });
      return data;
    },
    signup: async (email: string, password: string, name: string) => {
      const data = await apiClient.post("/auth/signup", {
        email,
        password,
        name,
      });
      return data;
    },
    refresh: async () => {
      const data = await apiClient.post("/auth/refresh");
      return data;
    },
    syncUser: async (accessToken: string) => {
      const data = await apiClient.post(
        "/auth/sync-user",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data;
    },
    logout: async () => {
      const data = await apiClient.post("/auth/logout");
      return data;
    },
  },
};

export default api;
