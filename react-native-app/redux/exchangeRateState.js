// redux/exchangeRateState.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiClient } from './apiClient';

// 모든 환율 데이터 조회
export const fetchAllExchangeRates = createAsyncThunk(
  'exchangeRate/fetchAllExchangeRates',
  async () => {
    const apiClient = getApiClient();
    const response = await apiClient.get('/api/exchange/all');
    return response.data;
  }
);

// 어제보다 환율이 하락한 상위 5개 통화 조회
export const fetchTop5DecreasingRates = createAsyncThunk(
  'exchangeRate/fetchTop5DecreasingRates',
  async () => {
    const apiClient = getApiClient();
    const response = await apiClient.get('/api/exchange/top5-decreasing');
    return response.data;
  }
);

// 특정 통화의 환율 히스토리 조회
export const fetchExchangeRateHistory = createAsyncThunk(
  'exchangeRate/fetchExchangeRateHistory',
  async (currencyCode) => {
    const apiClient = getApiClient();
    const response = await apiClient.get(`/api/exchange/history/${currencyCode}`);
    return { currencyCode, history: response.data }; // 통화 코드와 함께 반환
  }
);

const exchangeRateSlice = createSlice({
  name: 'exchangeRate',
  initialState: {
    allExchangeRates: [],
    top5Rates: [], // 하락한 상위 5개 통화
    exchangeRateHistory: {}, // 통화별 환율 히스토리
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 모든 환율 데이터
      .addCase(fetchAllExchangeRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.allExchangeRates = action.payload;
      })
      .addCase(fetchAllExchangeRates.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch all exchange rates';
      })

      // 어제보다 환율이 하락한 상위 5개 통화
      .addCase(fetchTop5DecreasingRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTop5DecreasingRates.fulfilled, (state, action) => {
        state.loading = false;
        state.top5Rates = action.payload;
      })
      .addCase(fetchTop5DecreasingRates.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch top 5 decreasing rates';
      })

      // 특정 통화의 환율 히스토리
      .addCase(fetchExchangeRateHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExchangeRateHistory.fulfilled, (state, action) => {
        state.loading = false;
        const { currencyCode, history } = action.payload;
        state.exchangeRateHistory[currencyCode] = history; // 통화별로 히스토리 저장
      })
      .addCase(fetchExchangeRateHistory.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch exchange rate history';
      });
  },
});

// useExchangeRate Hook 정의
import { useSelector, useDispatch } from 'react-redux';

export const useExchangeRate = () => {
  const dispatch = useDispatch();
  const { allExchangeRates, top5Rates, exchangeRateHistory, loading, error } = useSelector(
    (state) => state.exchangeRate
  );

  const fetchAllRates = () => {
    dispatch(fetchAllExchangeRates());
  };

  const fetchTop5Rates = () => {
    dispatch(fetchTop5DecreasingRates());
  };

  const fetchRateHistory = (currencyCode) => {
    dispatch(fetchExchangeRateHistory(currencyCode));
  };

  return {
    allExchangeRates,
    top5Rates,
    exchangeRateHistory,
    loading,
    error,
    fetchAllRates,
    fetchTop5Rates,
    fetchRateHistory,
  };
};

export default exchangeRateSlice.reducer;
