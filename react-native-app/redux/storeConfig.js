// redux/storeConfig.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import businessCardReducer from './businessCardSlice'; // businessCard 리듀서 추가
import travelCertificatesReducer from '../redux/travelCertificatesSlice';

const storeConfig = configureStore({
  reducer: {
    auth: authReducer,
    businessCard: businessCardReducer, // businessCard 리듀서 등록
    travelCertificates: travelCertificatesReducer, 
  },
});

export default storeConfig;
