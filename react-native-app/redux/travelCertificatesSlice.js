// redux/travelCertificateSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 비동기 액션 - 서버에서 여행 인증서 목록 가져오기
export const fetchTravelCertificates = createAsyncThunk(
  'travelCertificates/fetchTravelCertificates',
  async () => {
    const response = await axios.get('http://10.0.2.2:8080/api/travel-certificates/all');
    return response.data.sort((a, b) => new Date(b.traveldate) - new Date(a.traveldate)); // 날짜순 정렬
  }
);

const travelCertificatesSlice = createSlice({
  name: 'travelCertificates',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    deleteCertificate: (state, action) => {
      state.list = state.list.filter(certificate => certificate.travelid !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTravelCertificates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTravelCertificates.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchTravelCertificates.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { deleteCertificate } = travelCertificatesSlice.actions;

export default travelCertificatesSlice.reducer;
