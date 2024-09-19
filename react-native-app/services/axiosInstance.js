//axiosInstance.js

import axios from 'axios';

const createAxiosInstance = (token) => {
  const instance = axios.create({
    baseURL: 'http://10.0.2.2:8080',  // Android 에뮬레이터의 localhost
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // axios 인스턴스가 올바르게 생성되었는지 확인
  console.log('Axios instance created:', instance);
  console.log('Instance get method:', typeof instance.get);

  return instance;
};

export default createAxiosInstance;
