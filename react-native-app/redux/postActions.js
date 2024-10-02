import { setPosts, addPost, setLoading, setError } from './postReducer ';

export const fetchPosts = () => async (dispatch) => {
  dispatch(setLoading());
  try {
    // 실제 API 호출로 대체해야 합니다
    const response = await fetch('https://your-api-url.com/posts');
    const posts = await response.json();
    dispatch(setPosts(posts));
  } catch (error) {
    dispatch(setError('Failed to fetch posts'));
    console.error('Error fetching posts:', error);
  }
};

export const createPost = (postData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    // 실제 API 호출로 대체해야 합니다
    const response = await fetch('https://your-api-url.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    const newPost = await response.json();
    dispatch(addPost(newPost));
  } catch (error) {
    dispatch(setError('Failed to create post'));
    console.error('Error creating post:', error);
  }
};
