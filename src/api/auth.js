import apiClient from "./config";

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

export const register = async (credentials) => {
  try {
    const response = await apiClient.post("/register", credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

export const logout = async (token) => {
  try {
    const response = await apiClient.post("/logout", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

