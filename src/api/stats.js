import apiClient from "./config";

//get count of users
export const getUserCount = async (token) => {
  try {
    const response = await apiClient.get("/stats/users/count", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get count of posts
export const getPostCount = async (token) => {
  try {
    const response = await apiClient.get("/stats/Posts", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get count of fandoms
export const getFandomCount = async (token) => {
  try {
    const response = await apiClient.get("/stats/fandoms/count", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}


//count of medias

export const getMediaCount = async (token) => {
  try {
    const response = await apiClient.get("/stats/Medias", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//count of products

export const getProductCount = async (token) => {
  try {
    const response = await apiClient.get("/stats/Product", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}


//count of orders

export const getOrderCount = async (token) => {
  try {
    const response = await apiClient.get("/stats/Orders", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//count of tags

export const getTagCount = async (token) => {
  try {
    const response = await apiClient.get("/stats/Tags", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get trending hashtags

export const getTrendingHashtags = async (token) => {
  try {
    const response = await apiClient.get("/Y/hashtags/trending", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}


//get top trending fandoms

export const getTopTrendingFandoms = async (token) => {
  try {
    const response = await apiClient.get("/Y/fandoms/trending/top", { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}
