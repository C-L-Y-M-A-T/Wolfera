import cookies from "js-cookie";

export const getAuthToken = () => {
  return cookies.get("access_token");
};

export const logout = () => {
  cookies.remove("access_token");
  cookies.remove("refresh_token");
};
