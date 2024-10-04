import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiClient } from './apiClient';

// 친구 리스트 불러오기
export const fetchFriendsList = createAsyncThunk(
  'friend/fetchFriendsList',
  async (memberId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const apiClient = getApiClient(token);
      const response = await apiClient.get(`/api/friends/${memberId}/list`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Network error');
    }
  }
);

// 친구 추가
export const addFriendByBusinessCardId = createAsyncThunk(
  'friend/addFriendByBusinessCardId',
  async ({ memberId, businessCardId }, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const apiClient = getApiClient(token);
      const response = await apiClient.post(`/api/friends/${memberId}/add`, { businessCardId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Network error');
    }
  }
);

const friendSlice = createSlice({
  name: 'friend',
  initialState: {
    friendsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriendsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFriendsList.fulfilled, (state, action) => {
        state.loading = false;
        state.friendsList = action.payload;
      })
      .addCase(fetchFriendsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load friends list';
      })
      .addCase(addFriendByBusinessCardId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFriendByBusinessCardId.fulfilled, (state, action) => {
        state.loading = false;
        state.friendsList.push(action.payload); // 친구 추가 시 리스트에 업데이트
      })
      .addCase(addFriendByBusinessCardId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add friend';
      });
  },
});

export default friendSlice.reducer;
