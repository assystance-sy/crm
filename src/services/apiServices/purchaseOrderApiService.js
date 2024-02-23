import axios from 'axios';
import Config from 'react-native-config';

const apiService = axios.create({
  baseURL: `${Config.API_BASE_URL}/api/${Config.API_VERSION}`,
});

export const createPurchaseOrder = async data => {
  try {
    const response = await apiService.post('/purchaseOrder', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurchaseOrder = async (id, query) => {
  try {
    const response = await apiService.get(`/purchaseOrder/${id}`, {
      params: query,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPurchaseOrders = async (query = {}) => {
  try {
    const response = await apiService.get('/purchaseOrder', {params: query});
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
