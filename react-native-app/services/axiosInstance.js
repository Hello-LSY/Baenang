//services/axiosInstance.js
import axios from 'axios';

// 환경 변수 또는 설정 파일에서 API 엔드포인트를 불러옴
const API_BASE_URL = 'http://10.0.2.2:8080'; // 필요시 process.env.API_BASE_URL로 변경

const createAxiosInstance = (token) => {
  // 토큰이 없는 경우 예외 처리
  if (!token) {
    throw new Error('Authentication token is missing. Please provide a valid token.');
  }

  // axios 인스턴스 생성
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`, // 인증 헤더에 JWT 토큰 추가
      'Content-Type': 'application/json',
    },
    timeout: 5000, // 5초 동안 응답이 없으면 타임아웃
  });

  // 요청 인터셉터: 요청을 보내기 전에 실행되는 로직
  instance.interceptors.request.use(
    (config) => {
      // 요청 전에 추가 로직이 필요한 경우 여기서 처리
      console.log('Request Config:', config);
      return config;
    },
    (error) => {
      console.error('Request Error:', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터: 응답을 받았을 때 실행되는 로직
  instance.interceptors.response.use(
    (response) => {
      // 응답 데이터를 가공하거나 추가 처리
      console.log('Response Data:', response.data);
      return response;
    },
    (error) => {
      // 오류 응답 처리
      if (error.response) {
        // 서버가 오류 상태 코드를 반환했을 때
        console.error('Server Error:', error.response.data);
      } else if (error.request) {
        // 요청이 전송되었지만 응답이 없을 때
        console.error('No Response from Server:', error.request);
      } else {
        // 요청 설정 중에 발생한 오류
        console.error('Request Setup Error:', error.message);
      }
      return Promise.reject(error); // 오류를 호출한 곳으로 반환
    }
  );

  return instance;
};

export default createAxiosInstance;
