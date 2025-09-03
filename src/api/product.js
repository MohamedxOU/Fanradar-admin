import apiClient from "./config";

//get all products
export const getProducts = async () => {
  try {
    const response = await apiClient.get("/products", {
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//get product by id
export const getProductById = async (id) => {
  try {
    const response = await apiClient.get(`/products/${id}`, {
    });
    return response.data;
  }
  catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}

//create product
export const createProduct = async (productData, token) => {
  try {
    const response = await apiClient.post("/products", productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}


