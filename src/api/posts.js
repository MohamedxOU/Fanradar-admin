import apiClient from "./config";

//get all posts
export const getPosts = async (page = 1) => {
  try {
    const response = await apiClient.get("/posts", {
      params: { page }
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}
