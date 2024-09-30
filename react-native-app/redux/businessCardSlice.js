// redux/businessCardSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiClient } from './apiClient';

// 명함 데이터 조회
export const fetchBusinessCard = createAsyncThunk(
  'businessCard/fetchBusinessCard',
  async (memberId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const apiClient = getApiClient(token);
      const response = await apiClient.get(`/api/business-cards/members/${memberId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Network error');
    }
  }
);

// 명함 생성
export const createBusinessCard = createAsyncThunk(
  'businessCard/createBusinessCard',
  async ({ memberId, businessCardData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const apiClient = getApiClient(token);
      const response = await apiClient.post(`/api/business-cards/members/${memberId}`, businessCardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Network error');
    }
  }
);

// 명함 수정
export const updateBusinessCard = createAsyncThunk(
  'businessCard/updateBusinessCard',
  async ({ cardId, businessCardData }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const apiClient = getApiClient(token);
      const response = await apiClient.put(`/api/business-cards/${cardId}`, businessCardData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Network error');
    }
  }
);

const businessCardSlice = createSlice({
  name: 'businessCard',
  initialState: {
    businessCard: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBusinessCard: (state) => {
      state.businessCard = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinessCard.fulfilled, (state, action) => {
        state.loading = false;
        state.businessCard = action.payload;
      })
      .addCase(fetchBusinessCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch business card data';
      })
      .addCase(createBusinessCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusinessCard.fulfilled, (state, action) => {
        state.loading = false;
        state.businessCard = action.payload;
      })
      .addCase(createBusinessCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create business card';
      })
      .addCase(updateBusinessCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusinessCard.fulfilled, (state, action) => {
        state.loading = false;
        state.businessCard = action.payload;
      })
      .addCase(updateBusinessCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update business card';
      });
  },
});

export const { clearBusinessCard } = businessCardSlice.actions;
export default businessCardSlice.reducer;
