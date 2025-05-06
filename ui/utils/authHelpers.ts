import cookies from "js-cookie";
import { logout as serverLogout } from "../api/authService";

export const getAuthToken = () => {
  return cookies.get("access_token");
};

export const logout = async () => {
  try {
    await serverLogout();
    window.location.href = "/login";
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
