import axios from 'axios';

// 백엔드 서버 URL
const API_URL = 'http://localhost:8080/api/exchange';

// 환율 저장 API 호출
export const saveExchangeRate = (
  currencyCode,
  currencyName,
  exchangeRateValue
) => {
  return axios.post(`${API_URL}/save`, {
    currencyCode,
    currencyName,
    exchangeRateValue,
  });
};

// 모든 환율 조회 API 호출
export const getAllExchangeRates = () => {
  return axios.get(`${API_URL}/all`);
};

// 특정 기간 환율 조회 API 호출
export const getExchangeRatesBetween = (startDate, endDate) => {
  return axios.get(`${API_URL}/between`, {
    params: {
      startDate,
      endDate,
    },
  });
};
