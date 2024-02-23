import axios from 'axios';
import Config from 'react-native-config';

const apiService = axios.create({
  baseURL: `${Config.API_BASE_URL}/api/${Config.API_VERSION}`,
});
export const getProducts = async (query = {}) => {
  try {
    const response = await apiService.get('/product', {params: query});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProduct = async (id, query = {}) => {
  try {
    const response = await apiService.get(`/product/${id}`, {params: query});
    return response.data;
  } catch (error) {
    throw error;
  }
};
