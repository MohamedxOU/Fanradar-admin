import apiClient from "./config";

//get users
export const getUsers = async (token) => {
  try {
    const response = await apiClient.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get user by id
export const getUserById = async (id, token) => {
  try {
    const response = await apiClient.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//update user
export const updateUser = async (id, userData, token) => {
  try {
    const response = await apiClient.post(`/users/${id}`, userData, {

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//delete user
export const deleteUser = async (id, token) => {
  try {
    const response = await apiClient.delete(`admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//create user

export const createUser = async (userData) => {
  try {
    const response = await apiClient.post("/users", userData, {

    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}
