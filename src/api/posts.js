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


//get scheduled posts

export const getScheduledPosts = async (page = 1, token) => {
  try {
    const response = await apiClient.get("Y/posts/scheduled?is_scheduled=true", {
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



//delete post by id
export const deletePostById = async (id, token) => {
  try {
    const response = await apiClient.delete(`/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }

    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}
