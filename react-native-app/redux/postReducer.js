import { createSlice } from '@reduxjs/toolkit';

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setPosts: (state, action) => {
      state.items = action.payload;
      state.loading = false;
      state.error = null;
    },
    addPost: (state, action) => {
      state.items.unshift(action.payload);
    },
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setPosts, addPost, setLoading, setError } = postsSlice.actions;
export default postsSlice.reducer;
