import apiClient from "../utils/apiClient";

export const signup = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/signup", {
    email,
    password,
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });
  return response.data;
};

export const logout = async () => {
  await apiClient.post("/auth/logout");
};

export const refresh = async () => {
  const response = await apiClient.post("/auth/refresh");
  return response.data;
};

export const callback = async (access_token: string, refresh_token: string) => {
  const response = await apiClient.post("/auth/callback", {
    access_token,
    refresh_token,
  });
  return response.data;
};

export const googleSignIn = async (token: string) => {
  const response = await apiClient.post("/auth/google-signin", {
    token,
  });
  return response.data;
};
