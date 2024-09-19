import axios from 'axios';

const createAxiosInstance = (token) => {
  // 토큰이 유효한지 확인
  if (!token) {
    console.error('Token is missing');
    return null;  // 토큰이 없으면 null을 반환
  }

  // axios 인스턴스 생성
  const instance = axios.create({
    baseURL: 'http://10.0.2.2:8080',  // API 엔드포인트
    headers: {
      Authorization: `Bearer ${token}`, // 인증 헤더에 JWT 토큰 추가
      'Content-Type': 'application/json', // JSON 데이터 요청 시 사용
    },
  });

  console.log('Axios instance created:', instance);
  return instance;  // 올바르게 생성된 인스턴스를 반환
};

export default createAxiosInstance;
