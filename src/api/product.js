import apiClient from "./config";

//get all products
export const getProducts = async (page = 1, token) => {
  try {
    const response = await apiClient.get("/products", {
      params: { page }
      , headers: {
        Authorization: `Bearer ${token}`}

    },);

    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get product by id
export const getProductById = async (id, token) => {
  try {
    const response = await apiClient.get(`/products/${id}`, {
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



//create product
export const createProduct = async (productData,token
) => {
  try {
    const response = await apiClient.post("/products", productData, {
      headers: {
        Authorization: `Bearer ${token}`}


    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}


//update product
export const updateProduct = async (id, productData, token) => {
  try {
    const response = await apiClient.put(`/products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}


//delete product
export const deleteProduct = async (id, token) => {
  try {
    const response = await apiClient.delete(`/products/${id}`, {
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
