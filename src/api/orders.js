import apiClient from "./config";

//get all orders
export const getOrders = async (token) => {
  try {
    const response = await apiClient.get("/orders", {
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


//get order by id
export const getOrderById = async (id, token) => {
  try {
    const response = await apiClient.get(`/orders/${id}`, {
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


//update order
export const updateOrder = async (id, orderData, token) => {
  try {
    const response = await apiClient.put(`/orders/${id}`, orderData, {
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


//delete order
export const deleteOrder = async (id, token) => {
  try {
    const response = await apiClient.delete(`/orders/${id}`, {
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
