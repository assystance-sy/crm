import axios from 'axios';
import Config from 'react-native-config';

const apiService = axios.create({
  baseURL: `${Config.API_BASE_URL}/api/${Config.API_VERSION}`,
});

export const createPurchaseOrderItem = async data => {
  try {
    const response = await apiService.post('/purchaseOrderItem', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurchaseOrderItems = async (query = {}) => {
  try {
    const response = await apiService.get('/purchaseOrderItem', {
      params: query,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
