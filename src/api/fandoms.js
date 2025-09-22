import apiClient from "./config";

//get all fandoms (needs token)
export const getFandoms = async (token) => {
  try {
    const response = await apiClient.get("/Y/fandoms", {
      headers: {
        Authorization: `Bearer ${token}`}
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get single fandom by id (needs token)

export const getFandomById = async (id, token) => {
  try {
    const response = await apiClient.get(`/Y/fandoms/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`}
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}


//delete fandom by id (needs token)
export const deleteFandomById = async (id, token) => {
  try {
    const response = await apiClient.delete(`/Y/fandoms/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`}
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//create fandom (needs token)
export const createFandom = async (fandomData, token) => {
  try {
    const response = await apiClient.post("/Y/fandoms", fandomData, {
      headers: {
        Authorization: `Bearer ${token}`}
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}
