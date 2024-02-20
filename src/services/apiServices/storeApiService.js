import axios from 'axios';
import Config from 'react-native-config';

const apiService = axios.create({
  baseURL: `${Config.API_BASE_URL}/api/${Config.API_VERSION}`,
});

export const getStores = async (query = {}) => {
  try {
    const response = await apiService.get(
      `${Config.API_BASE_URL}/api/${Config.API_VERSION}/store`,
      {params: query},
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStore = async (id, query = {}) => {
  try {
    const response = await apiService.get(
      `${Config.API_BASE_URL}/api/${Config.API_VERSION}/store/${id}`,
      {params: query},
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
