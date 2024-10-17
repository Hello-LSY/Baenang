import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getApiClient } from './apiClient';

// 특정 게시글의 댓글 가져오기
export const fetchCommentsByPostId = createAsyncThunk('comments/fetchComments', async (postId, thunkAPI) => {
  const response = await getApiClient().get(`/api/comments/post/${postId}`);
  return { postId, comments: response.data };
});

// 댓글 작성
export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }, { getState }) => {
    const state = getState();
    // console.log("Current state in createComment:", state);
    const memberId = state.auth.memberId;  // auth 상태에서 memberId 가져오기
    // console.log("Creating comment with memberId:", memberId);
    const response = await getApiClient().post(`/api/comments/post/${postId}`, {
      memberId,  // memberId 추가
      content,
    });
    return { postId, comment: response.data };
  }
);

// 댓글 삭제
export const deleteComment = createAsyncThunk('comments/deleteComment', async (commentId, thunkAPI) => {
  await getApiClient().delete(`/api/comments/${commentId}`);
  return commentId;
});

const commentSlice = createSlice({
  name: 'comments',
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPostId.fulfilled, (state, action) => {
        state[action.payload.postId] = action.payload.comments;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state[action.payload.postId].push(action.payload.comment);
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        for (const postId in state) {
          state[postId] = state[postId].filter((comment) => comment.id !== action.payload);
        }
      });
  },
});

export default commentSlice.reducer;
