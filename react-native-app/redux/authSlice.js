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
      
      // 로그인 시 서버로부터 추가로 받아올 데이터들
      const { token, memberId, email, registrationNumber, nickname } = response.data;

      // 로그인 정보 저장
      await authStorage.storeCredentials(token, memberId);

      // 필요한 정보를 리턴
      return { token, memberId, email, registrationNumber, nickname };
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
    email: null, // 이메일 필드 추가
    registrationNumber: null, // 주민등록번호 필드 추가
    nickname: null, // 닉네임 필드 추가
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.memberId = action.payload.memberId;
      state.email = action.payload.email; // 이메일 업데이트
      state.registrationNumber = action.payload.registrationNumber; // 주민등록번호 업데이트
      state.nickname = action.payload.nickname; // 닉네임 업데이트
    },
    clearCredentials: (state) => {
      state.token = null;
      state.memberId = null;
      state.email = null; // 이메일 필드 초기화
      state.registrationNumber = null; // 주민등록번호 필드 초기화
      state.nickname = null; // 닉네임 필드 초기화
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
        state.email = action.payload.email; // 로그인 성공 시 이메일 저장
        state.registrationNumber = action.payload.registrationNumber; // 주민등록번호 저장
        state.nickname = action.payload.nickname; // 닉네임 저장
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
