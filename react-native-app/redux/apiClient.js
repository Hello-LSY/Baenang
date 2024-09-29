// redux/apiClient.js
import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8080'; // 필요에 따라 설정

export const getApiClient = (token = '') => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers,
    timeout: 5000,
  });

  instance.interceptors.request.use(
    (config) => {
      console.log('Request Config:', config);
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      console.log('Response Data:', response.data);
      return response;
    },
    (error) => {
      if (error.response) {
        console.error('Server Error:', error.response.data);
      } else if (error.request) {
        console.error('No Response from Server:', error.request);
      } else {
        console.error('Request Setup Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
