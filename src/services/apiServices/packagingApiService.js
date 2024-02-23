import axios from 'axios';
import Config from 'react-native-config';

const apiService = axios.create({
  baseURL: `${Config.API_BASE_URL}/api/${Config.API_VERSION}`,
});
export const getPackagings = async (query = {}) => {
  try {
    const response = await apiService.get('/packaging', {params: query});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPackaging = async data => {
  try {
    const response = await apiService.post('/packaging', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
