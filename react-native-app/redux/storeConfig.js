// redux/storeConfig.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import businessCardReducer from "./businessCardSlice";
import travelCertificatesReducer from "./travelCertificatesSlice";
import exchangeRateReducer from "./exchangeRateState";
import postReducer from "./postSlice";
import friendReducer from "./friendSlice";
import commentReducer from "./commentSlice";
import documentReducer from "./documentSlice";
import documentItemReducer from "./documentItemSlice";
import profileReducer from './profileSlice';

const storeConfig = configureStore({
  reducer: {
    auth: authReducer,
    businessCard: businessCardReducer,
    travelCertificates: travelCertificatesReducer,
    exchangeRate: exchangeRateReducer,
    post: postReducer,
    comment: commentReducer,
    friend: friendReducer,
    document: documentReducer,
    documentItem : documentItemReducer,
    profile : profileReducer,
  },
});

export default storeConfig;
