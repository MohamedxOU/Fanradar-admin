import apiClient from "./config";

//get all posts
export const getPosts = async (page = 1, token) => {
  try {
    const response = await apiClient.get("/posts", {
      params: { page }
      , headers: {
        Authorization: `Bearer ${token}`}
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}
