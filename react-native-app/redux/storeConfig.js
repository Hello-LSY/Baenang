// redux/storeConfig.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import businessCardReducer from './businessCardSlice'; // businessCard 리듀서 추가
import exchangeRateReducer from './exchangeRateState'; // exchangeRate 리듀서 추가

const storeConfig = configureStore({
  reducer: {
    auth: authReducer,
    businessCard: businessCardReducer, // businessCard 리듀서 등록
    exchangeRate: exchangeRateReducer, // exchangeRate 리듀서 등록
  },
});

export default storeConfig;
