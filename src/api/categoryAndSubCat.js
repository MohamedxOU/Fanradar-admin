import apiClient from "./config";

//get all categories
export const getCategories = async (token) => {
  try {
    const response = await apiClient.get("/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },

    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get category with it's subcategories by id
export const getCategoryWithSubCategories = async (id, token) => {
  try {
    const response = await apiClient.get(`/categories/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}



//create category
export const createCategory = async (categoryData, token) => {
  try {
    const headers = {
      Authorization: `Bearer ${token}`
    }

    // Don't set Content-Type for FormData, let browser handle it
    if (!(categoryData instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await apiClient.post("/categories", categoryData, {
      headers
    });
    return response.data;
  }
  catch (error) {
    console.error('CreateCategory API Error:', error)
    console.error('Response status:', error.response?.status)
    console.error('Response data:', error.response?.data)
    throw error.response ? error.response.data : error.message;
  }
}

//update category
export const updateCategory = async (id, categoryData, token) => {
  try {
    const response = await apiClient.put(`/categories/${id}`, categoryData, {
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

//delete category
export const deleteCategory = async (id, token) => {
  try {
    const response = await apiClient.delete(`/categories/${id}`, {
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




//get all subcategories
export const getSubCategories = async (token) => {
  try {
    const response = await apiClient.get("/subcategories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get subcategory by id
export const getSubCategoryById = async (id, token) => {
  try {
    const response = await apiClient.get(`/subcategories/${id}`, {

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//create subcategory
export const createSubCategory = async (subCategoryData, token) => {
  try {
    const response = await apiClient.post("/subcategories", subCategoryData, {
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

//update subcategory
export const updateSubCategory = async (id, subCategoryData, token) => {
  try {
    const response = await apiClient.put(`/subcategories/${id}`, subCategoryData, {
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

//delete subcategory
export const deleteSubCategory = async (id, token) => {
  try {
    const response = await apiClient.delete(`/subcategories/${id}`, {
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


