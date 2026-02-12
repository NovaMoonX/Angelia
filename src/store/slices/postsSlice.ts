import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post, mockPosts } from '@lib/post';
import { resetAllState } from '@store/actions/globalActions';

interface PostsState {
  items: Post[];
}

const initialState: PostsState = {
  items: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.items = action.payload;
    },
    addPost: (state, action: PayloadAction<Post>) => {
      state.items.unshift(action.payload);
    },
    clearPosts: (state) => {
      state.items = [];
    },
    loadDemoPosts: (state) => {
      state.items = mockPosts;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => initialState);
  },
});

export const { setPosts, addPost, clearPosts, loadDemoPosts } = postsSlice.actions;
export default postsSlice.reducer;
