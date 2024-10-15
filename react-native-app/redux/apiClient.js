// redux/apiClient.js

import axios from 'axios';
import { BASE_URL } from '../constants/config';

export const getApiClient = (token = '') => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const instance = axios.create({
    baseURL: BASE_URL,
    headers,
    timeout: 5000,
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      // console.log('Request Config:', config); // 요청 로그
      return config;
    },
    (error) => {
      // console.error('Request Error:', error); // 요청 오류 로그
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response) => {
      // console.log('Response Data:', response.data); // 응답 로그
      return response;
    },
    (error) => {
      if (error.response) {
        // 서버에서 오류 응답을 받았을 때
        // console.error('Server Error:', error.response.data);
        if (error.response.status === 401) {
          // console.error('Unauthorized! Please check the token.'); 
          // 401 에러가 발생하면 토큰 만료나 인증 문제로 로그아웃 처리하거나 리프레시 로직 실행
        }
      } else if (error.request) {
        // 요청이 서버에 도달하지 않았을 때
        // console.error('No Response from Server:', error.request);
      } else {
        // 요청 설정 중 발생한 오류
        // console.error('Request Setup Error:', error.message);
      }
      return Promise.reject(error);
    }
  );

  return instance;
};
