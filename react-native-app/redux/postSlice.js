import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiClient } from './apiClient';

// 게시글 목록 가져오기
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async (_, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState(); // auth 상태에서 token 가져오기
    const apiClient = getApiClient(auth.token); // 토큰 포함 API 클라이언트 생성
    const response = await apiClient.get('/api/posts');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response ? error.response.data : { message: 'Network error' });
  }
});

// 게시글 작성
export const createPost = createAsyncThunk('posts/createPost', async (postData, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState(); // auth 상태에서 token과 memberId 가져오기
    const memberId = auth.memberId;
    const apiClient = getApiClient(auth.token); // 토큰 포함 API 클라이언트 생성

    const response = await apiClient.post('/api/posts/create', { ...postData, memberId }, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response ? error.response.data : { message: 'Network error' });
  }
});

// 게시글 삭제
export const deletePost = createAsyncThunk('posts/deletePost', async (postId, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState(); // auth 상태에서 token 가져오기
    const apiClient = getApiClient(auth.token); // 토큰 포함 API 클라이언트 생성

    await apiClient.delete(`/api/posts/${postId}`);
    return postId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response ? error.response.data : { message: 'Network error' });
  }
});

// 좋아요 기능 (toggle like)
export const toggleLike = createAsyncThunk('posts/toggleLike', async ({ postId, liked }, thunkAPI) => {
  try {
    const { auth } = thunkAPI.getState(); // auth 상태에서 token과 memberId 가져오기
    const memberId = auth.memberId;
    const apiClient = getApiClient(auth.token); // 토큰 포함 API 클라이언트 생성

    if (liked) {
      await apiClient.delete(`/api/likes/post/${postId}/member/${memberId}`); // 좋아요 취소 API 호출
      return { postId, liked: false }; // 서버에서 좋아요 취소됨
    } else {
      await apiClient.post(`/api/likes/post/${postId}/member/${memberId}`); // 좋아요 API 호출
      return { postId, liked: true }; // 서버에서 좋아요 성공
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response ? error.response.data : { message: 'Network error' });
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
        state.error = action.payload || { message: '데이터를 가져오는 중 문제가 발생했습니다.' };
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
          post.liked = action.payload.liked;  // 좋아요 상태를 갱신
          post.likeCount += action.payload.liked ? 1 : -1; // 좋아요 수 갱신
        }
      });
  },
});

export default postsSlice.reducer;
