import apiClient from "./config";

//get all products
export const getProducts = async (page = 1) => {
  try {
    const response = await apiClient.get("/products", {
      params: { page }
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
export const createProduct = async (productData
) => {
  try {
    const response = await apiClient.post("/products", productData, {

    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
}


