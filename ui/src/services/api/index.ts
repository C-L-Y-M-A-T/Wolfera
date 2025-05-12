import apiClient from "./client";

const api = {
  users: {
    sync: async (
      accessToken: string,
      email?: string,
      username?: string,
      avatar_url?: string,
    ) => {
      const data = await apiClient.post(
        "/users/sync",
        {
          email,
          username,
          avatar_url,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return data;
    },
    me: async (accessToken: string) => {
      const data = await apiClient.get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return data;
    },
  },
};

export default api;
