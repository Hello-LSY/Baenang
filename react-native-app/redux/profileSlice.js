import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

// 프로필 정보 가져오기
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.get(`${BASE_URL}/api/profile/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('프로필 데이터:', response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '프로필 정보 가져오기 실패');
    }
  }
);

// 비밀번호 확인 Thunk
export const checkPassword = createAsyncThunk(
  'profile/checkPassword',
  async ({ password }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.post(
        `${BASE_URL}/api/profile/check-password`,
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data; // 비밀번호 일치 여부 (true or false)
    } catch (error) {
      return rejectWithValue(error.response?.data || '비밀번호 확인 실패');
    }
  }
);

// 프로필 업데이트 Thunk
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (updatedProfile, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.put(
        `${BASE_URL}/api/profile/update`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || '프로필 업데이트 실패');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    profile: {},
    isPasswordChecked: false,
    error: null,
  },
  reducers: {
    clearProfileState: (state) => {
      state.isPasswordChecked = false;
      state.error = null;
    },
    // 비밀번호 확인 상태 초기화
    resetPasswordCheck: (state) => {
      state.isPasswordChecked = false; // 비밀번호 확인 상태 초기화
    },
  },
  extraReducers: (builder) => {
    builder
      // 비밀번호 확인 성공 시
      .addCase(checkPassword.fulfilled, (state, action) => {
        state.isPasswordChecked = action.payload;
        state.error = null;
      })
      // 비밀번호 확인 실패 시
      .addCase(checkPassword.rejected, (state, action) => {
        state.isPasswordChecked = false;
        state.error = action.payload;
      })
      // 프로필 업데이트 성공 시
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.error = null;
      })
      // 프로필 업데이트 실패 시
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload;
      })
      // 프로필 가져오기 성공 시
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.error = null;
      })
      // 프로필 가져오기 실패 시
      .addCase(fetchProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearProfileState, resetPasswordCheck } = profileSlice.actions;
export default profileSlice.reducer;
