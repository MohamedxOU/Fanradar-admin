import apiClient from "./config";

//get all categories
export const getCategories = async () => {
  try {
    const response = await apiClient.get("/categories", {

    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get all subcategories
export const getSubCategories = async () => {
  try {
    const response = await apiClient.get("/subcategories", {
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}


