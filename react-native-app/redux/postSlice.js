import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiClient } from './apiClient';

// 게시글 목록 가져오기
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, thunkAPI) => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.get('/api/posts');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response ? error.response.data : 'Network error');
  }
});

// 게시글 작성
export const createPost = createAsyncThunk('posts/createPost', async (postData, thunkAPI) => {
  try {
    const apiClient = getApiClient();
    const response = await apiClient.post('/api/posts/create', postData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response ? error.response.data : 'Network error');
  }
});

// 게시글 삭제
export const deletePost = createAsyncThunk('posts/deletePost', async (postId, thunkAPI) => {
  try {
    const apiClient = getApiClient();
    await apiClient.delete(`/api/posts/${postId}`);
    return postId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response ? error.response.data : 'Network error');
  }
});

// 좋아요 기능
export const toggleLike = createAsyncThunk('posts/toggleLike', async ({ postId, memberId }, thunkAPI) => {
  try {
    const apiClient = getApiClient();
    await apiClient.post(`/api/likes/post/${postId}/member/${memberId}`);
    return { postId, liked: true };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response ? error.response.data : 'Network error');
  }
});

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.items.find((item) => item.id === action.payload.postId);
        if (post) {
          post.likes += action.payload.liked ? 1 : -1;
        }
      });
  },
});

export default postsSlice.reducer;
