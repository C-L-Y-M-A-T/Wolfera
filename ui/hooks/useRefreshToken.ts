import { useEffect } from "react";
import { refresh } from "../api/authService";

export const useRefreshToken = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await refresh();
        console.log("Token refreshed");
      } catch (err) {
        console.error("Failed to refresh token", err);
      }
    }, 1000 * 60 * 55);

    return () => clearInterval(interval);
  }, []);
};
