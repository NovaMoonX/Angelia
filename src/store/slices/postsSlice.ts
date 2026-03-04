import { Comment, mockPosts, Post, Reaction } from '@lib/post';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetAllState } from '@store/actions/globalActions';
import { RootState } from '..';
import { selectChannelMapById } from './channelsSlice';
import { selectAllUsersMapById } from './usersSlice';

interface PostsState {
  items: Post[];
  previousReactions: Record<string, Reaction[]>; // For optimistic UI rollback
  previousComments: Record<string, Comment[]>; // For optimistic UI rollback
}

const initialState: PostsState = {
  items: [],
  previousReactions: {},
  previousComments: {},
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
    updateReactionsOptimistic: (
      state,
      action: PayloadAction<{ postId: string; newReaction: Reaction }>,
    ) => {
      const { postId, newReaction } = action.payload;
      const post = state.items.find((p) => p.id === postId);
      if (post) {
        state.previousReactions[postId] = post.reactions;
        post.reactions = [...post.reactions, newReaction];
      }
    },
    removeReactionOptimistic: (
      state,
      action: PayloadAction<{ postId: string; emoji: string; userId: string }>,
    ) => {
      const { postId, emoji, userId } = action.payload;
      const post = state.items.find((p) => p.id === postId);
      if (post) {
        state.previousReactions[postId] = post.reactions;
        // Remove reactions that match the emoji and userId
        post.reactions = post.reactions.filter(
          (r) => !(r.emoji === emoji && r.userId === userId),
        );
      }
    },
    revertReactionsOptimistic: (
      state,
      action: PayloadAction<{ postId: string }>,
    ) => {
      const { postId } = action.payload;
      const post = state.items.find((p) => p.id === postId);
      if (post && state.previousReactions[postId]) {
        post.reactions = state.previousReactions[postId];
        delete state.previousReactions[postId];
      }
    },
    updateCommentsOptimistic: (
      state,
      action: PayloadAction<{ postId: string; newComment: Comment }>,
    ) => {
      const { postId, newComment } = action.payload;
      const post = state.items.find((p) => p.id === postId);
      if (post) {
        state.previousComments[postId] = post.comments;
        post.comments = [...post.comments, newComment];
      }
    },
    revertCommentsOptimistic: (
      state,
      action: PayloadAction<{ postId: string }>,
    ) => {
      const { postId } = action.payload;
      const post = state.items.find((p) => p.id === postId);
      if (post && state.previousComments[postId]) {
        post.comments = state.previousComments[postId];
        delete state.previousComments[postId];
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => initialState);
  },
});

export const {
  setPosts,
  addPost,
  clearPosts,
  loadDemoPosts,
  updateReactionsOptimistic,
  removeReactionOptimistic,
  revertReactionsOptimistic,
  updateCommentsOptimistic,
  revertCommentsOptimistic,
} = postsSlice.actions;
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
  (allUsersMapById, post) => (post ? allUsersMapById[post.authorId] : null),
);

export const selectPostChannel = createSelector(
  [selectChannelMapById, (_: RootState, post?: Post | null) => post],
  (channelMapById, post) => (post ? channelMapById[post.channelId] : null),
);
