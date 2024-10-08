// Redux authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authStorage from './authStorage';
import { getApiClient } from './apiClient';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, thunkAPI) => {
    try {
      const apiClient = getApiClient();
      const response = await apiClient.post('/api/auth/login', { username, password });

      const { token, memberId, email, registrationNumber, nickname, fullName } = response.data; // fullName 사용
      // 로그인 정보 저장
      await authStorage.storeCredentials(token, memberId, email, registrationNumber, nickname, fullName);

      return { token, memberId, email, registrationNumber, nickname, fullName }; // fullName 리턴
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response ? error.response.data : 'Network error');
    }
  }
);

export const loadCredentials = createAsyncThunk(
  'auth/loadCredentials',
  async () => {
    const { token, memberId, email, registrationNumber, nickname, fullName } = await authStorage.getCredentials(); // fullName 추가
    return { token, memberId, email, registrationNumber, nickname, fullName };
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    memberId: null,
    email: null,
    registrationNumber: null,
    nickname: null,
    fullName: null, // fullName 필드 추가
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.memberId = action.payload.memberId;
      state.email = action.payload.email;
      state.registrationNumber = action.payload.registrationNumber;
      state.nickname = action.payload.nickname;
      state.fullName = action.payload.fullName; // fullName 설정
    },
    clearCredentials: (state) => {
      state.token = null;
      state.memberId = null;
      state.email = null;
      state.registrationNumber = null;
      state.nickname = null;
      state.fullName = null; // fullName 초기화
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
        state.email = action.payload.email;
        state.registrationNumber = action.payload.registrationNumber;
        state.nickname = action.payload.nickname;
        state.fullName = action.payload.fullName; // fullName 저장
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(loadCredentials.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.memberId = action.payload.memberId;
        state.email = action.payload.email;
        state.registrationNumber = action.payload.registrationNumber;
        state.nickname = action.payload.nickname;
        state.fullName = action.payload.fullName; // fullName 저장
      });
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
