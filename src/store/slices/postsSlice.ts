import { mockPosts, Post } from '@lib/post';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetAllState } from '@store/actions/globalActions';
import { RootState } from '..';
import { selectChannelMapById } from './channelsSlice';
import { selectAllUsersMapById } from './usersSlice';

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

export const { setPosts, addPost, clearPosts, loadDemoPosts } =
  postsSlice.actions;
export default postsSlice.reducer;

const selectPostsMapById = createSelector(
  (state: { posts: PostsState }) => state.posts.items,
  (posts) => {
    const map = posts.reduce(
      (acc, post) => {
        acc[post.id] = post;
        return acc;
      },
      {} as Record<string, Post>,
    );
    return map;
  },
);

export const selectPostById = createSelector(
  [selectPostsMapById, (_: RootState, postId?: string) => postId],
  (postsMap, postId) => (postId ? postsMap[postId] : null),
);

export const selectPostAuthor = createSelector(
  [selectAllUsersMapById, (_: RootState, post?: Post | null) => post],
  (allUsersMapById, post) =>
    post ? allUsersMapById[post.authorId] : null,
);

export const selectPostChannel = createSelector(
  [selectChannelMapById, (_: RootState, post?: Post | null) => post],
  (channelMapById, post) => (post ? channelMapById[post.channelId] : null),
);
