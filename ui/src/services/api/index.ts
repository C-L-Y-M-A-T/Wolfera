import { AvatarConfigType } from "@/types/avatar-builder/avatarConfig";
import apiClient from "./client";

const api = {
  users: {
    sync: async (
      accessToken: string,
      email?: string,
      username?: string,
      avatarOptions?: Record<keyof AvatarConfigType, number>,
    ) => {
      const data = await apiClient.post(
        "/users/sync",
        {
          email,
          username,
          avatarOptions,
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
