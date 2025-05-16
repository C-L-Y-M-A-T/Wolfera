import api from "@/services/api";
import { useEffect } from "react";

export const useRefreshToken = () => {
  useEffect(() => {
    const interval = setInterval(
      async () => {
        try {
          await api.auth.refresh();
          console.log("Token refreshed");
        } catch (err) {
          console.error("Failed to refresh token", err);
        }
      },
      1000 * 60 * 55,
    );

    return () => clearInterval(interval);
  }, []);
};
