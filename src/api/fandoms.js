import apiClient from "./config";

//get all fandoms (needs token)
export const getFandoms = async (token) => {
  try {
    const response = await apiClient.get("/fandoms", {
      headers: {
        Authorization: `Bearer ${token}`}
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get active fandoms (needs token)
export const getActiveFandoms = async (token) => {
  try {
    const response = await apiClient.get("/admin/fandoms?isactive=true", {
      headers: {
        Authorization: `Bearer ${token}`}
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get inactive fandoms (needs token)
export const getInactiveFandoms = async (token) => {
  try {
    const response = await apiClient.get("/admin/fandoms?isactive=false", {
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
    const response = await apiClient.get(`/fandoms/${id}`, {
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
    const response = await apiClient.delete(`/fandoms/${id}`, {
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


//update fandom (needs token)
export const updateFandom = async (id, fandomData, token) => {
  try {
    const response = await apiClient.put(`/fandoms/${id}`, fandomData, {
      headers: {
        Authorization: `Bearer ${token}`}
    });
    
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}