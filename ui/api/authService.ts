import axios from "axios";

const API_URL = "http://localhost:2000/auth";

export const signup = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/signup`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );
  return response.data;
};
