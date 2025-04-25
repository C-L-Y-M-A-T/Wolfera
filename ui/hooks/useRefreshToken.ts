import axios from "axios";
import { useEffect } from "react";

export const useRefreshToken = () => {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axios.post(
          "http://localhost:3000/auth/refresh",
          {},
          { withCredentials: true }
        );
        console.log("Token refreshed");
      } catch (err) {
        console.error("Failed to refresh token", err);
      }
    }, 1000 * 60 * 55);

    return () => clearInterval(interval);
  }, []);
};
