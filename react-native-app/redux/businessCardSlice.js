//redux/businessCardSlice.js
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

// 명함 삭제
export const deleteBusinessCard = createAsyncThunk(
  'businessCard/deleteBusinessCard',
  async (cardId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const apiClient = getApiClient(token);
      await apiClient.delete(`/api/business-cards/${cardId}`);
      return cardId;
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
      .addCase(deleteBusinessCard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBusinessCard.fulfilled, (state, action) => {
        state.loading = false;
        state.businessCard = null;
      })
      .addCase(deleteBusinessCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete business card';
      });
  },
});

export const { clearBusinessCard } = businessCardSlice.actions;
export default businessCardSlice.reducer;
