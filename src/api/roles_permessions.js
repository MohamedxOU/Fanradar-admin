import apiClient from "./config";

// get all roles
export const getRoles = async () => {
  try {
    const response = await apiClient.get("/roles-permissions", {

    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};
