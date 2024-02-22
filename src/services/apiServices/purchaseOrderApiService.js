import axios from 'axios';
import Config from 'react-native-config';

const apiService = axios.create({
  baseURL: `${Config.API_BASE_URL}/api/${Config.API_VERSION}`,
});

export const createPurchaseOrder = async () => {
  try {
    const response = await apiService.post('/purchaseOrder');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurchaseOrder = async id => {
  try {
    const response = await apiService.get(`/purchaseOrder/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePurchaseOrder = async (id, data) => {
  try {
    const response = await apiService.put(`/purchaseOrder/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
