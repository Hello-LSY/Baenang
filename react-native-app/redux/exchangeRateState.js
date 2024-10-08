import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiClient } from './apiClient';
import { useSelector, useDispatch } from 'react-redux';

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
  async (_, { getState }) => {
    const { auth } = getState(); // auth 상태에서 토큰을 가져옴
    const apiClient = getApiClient(auth.token); // 토큰을 포함하여 API 클라이언트 생성
    const response = await apiClient.get('/api/exchange/top5-decreasing');

    return response.data.map((item) => ({
      ...item,
      isDecreasing: item.exchangeChangePercentage < 0, // 하락했으면 true
    }));
  }
);

// 특정 통화의 환율 히스토리 조회 
export const fetchExchangeRateHistory = createAsyncThunk(
  'exchangeRate/fetchExchangeRateHistory',
  async (currencyCode, { getState }) => {
    const { auth } = getState(); // auth 상태에서 토큰을 가져옴
    const apiClient = getApiClient(auth.token); // 토큰을 포함하여 API 클라이언트 생성
    const response = await apiClient.get(`/api/exchange/${currencyCode}`);
    return { currencyCode, history: response.data }; // 통화 코드와 함께 반환
  }
);

// 최신 환율 데이터 조회
export const fetchLatestExchangeRates = createAsyncThunk(
  'exchangeRate/fetchLatestExchangeRates',
  async () => {
    const apiClient = getApiClient();
    const response = await apiClient.get('/api/exchange/latest');
    return response.data;
  }
);

const exchangeRateSlice = createSlice({
  name: 'exchangeRate',
  initialState: {
    allExchangeRates: [],
    top5Rates: [], // 하락한 상위 5개 통화
    exchangeRateHistory: {}, // 통화별 환율 히스토리
    latestExchangeRates: [], // 최신 환율 정보
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
      })

      // 최신 환율 데이터
      .addCase(fetchLatestExchangeRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestExchangeRates.fulfilled, (state, action) => {
        state.loading = false;
        state.latestExchangeRates = action.payload;
      })
      .addCase(fetchLatestExchangeRates.rejected, (state) => {
        state.loading = false;
        state.error = 'Failed to fetch latest exchange rates';
      });
  },
});

// 커스텀 훅으로 환율 상태를 불러오고 액션을 디스패치하는 함수 정의
export const useExchangeRate = () => {
  const dispatch = useDispatch();
  const { 
    allExchangeRates, 
    top5Rates, 
    exchangeRateHistory, 
    latestExchangeRates, 
    loading, 
    error 
  } = useSelector((state) => state.exchangeRate);

  const fetchAllRates = () => {
    dispatch(fetchAllExchangeRates());
  };

  const fetchTop5Rates = () => {
    dispatch(fetchTop5DecreasingRates());
  };

  const fetchRateHistory = (currencyCode) => {
    dispatch(fetchExchangeRateHistory(currencyCode));
  };

  const fetchLatestRates = () => {
    dispatch(fetchLatestExchangeRates());
  };

  return {
    allExchangeRates,
    top5Rates,
    exchangeRateHistory,
    latestExchangeRates,
    loading,
    error,
    fetchAllRates,
    fetchTop5Rates,
    fetchRateHistory,
    fetchLatestRates,
  };
};

export default exchangeRateSlice.reducer;
