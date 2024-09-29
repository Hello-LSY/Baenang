// redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authStorage from './authStorage';
import { getApiClient } from './apiClient';

// 비동기 작업 정의 (로그인)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, thunkAPI) => {
    try {
      const apiClient = getApiClient(); // 토큰 없이 API 클라이언트 호출
      const response = await apiClient.post('/api/auth/login', { username, password });
      const { token, memberId } = response.data;
      await authStorage.storeCredentials(token, memberId);
      return { token, memberId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : 'Network error');
    }
  }
);

// 비동기 작업 정의 (토큰 로드)
export const loadCredentials = createAsyncThunk(
  'auth/loadCredentials',
  async () => {
    const { token, memberId } = await authStorage.getCredentials();
    return { token, memberId };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    memberId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.memberId = action.payload.memberId;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.memberId = null;
      authStorage.clearCredentials();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.memberId = action.payload.memberId;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(loadCredentials.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadCredentials.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.memberId = action.payload.memberId;
      })
      .addCase(loadCredentials.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
