import { AppDispatch } from '@/store';
import { setPosts } from '@/store/slices/postsSlice';
import { and, collection, onSnapshot, or, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from './post.types';

// Firestore 'in' operator supports a maximum of 30 values per query.
const CHANNEL_BATCH_SIZE = 30;

/**
 * Subscribe to posts authored by the given user or belonging to any of the
 * provided channel IDs. Re-call with updated channelIds whenever the user's
 * set of accessible channels changes.
 *
 * When channelIds exceeds 30 (Firestore's 'in' limit), multiple listeners are
 * created and their results are merged before dispatching to Redux.
 */
export const subscribeToPosts = (uid: string, channelIds: string[]) => (dispatch: AppDispatch) => {
  const deletionFilter = where('markedForDeletionAt', '==', null);

  if (channelIds.length === 0) {
    const q = query(
      collection(db, 'posts'),
      deletionFilter,
      where('authorId', '==', uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map((doc) => doc.data() as Post);
      dispatch(setPosts(posts));
    });

    return unsubscribe;
  }

  // Split channelIds into chunks to stay within Firestore's 'in' limit
  const chunks: string[][] = [];
  for (let i = 0; i < channelIds.length; i += CHANNEL_BATCH_SIZE) {
    chunks.push(channelIds.slice(i, i + CHANNEL_BATCH_SIZE));
  }

  // Accumulate results per batch; merge and dispatch on any update
  const batchResults: Map<string, Post>[] = chunks.map(() => new Map());

  const mergeAndDispatch = () => {
    const merged = new Map<string, Post>();
    batchResults.forEach((batch) => batch.forEach((post, id) => merged.set(id, post)));
    dispatch(setPosts(Array.from(merged.values())));
  };

  const unsubscribes = chunks.map((chunk, index) => {
    const q = query(
      collection(db, 'posts'),
      and(
        deletionFilter,
        or(
          where('authorId', '==', uid),
          where('channelId', 'in', chunk),
        ),
      ),
    );

    return onSnapshot(q, (snapshot) => {
      batchResults[index] = new Map(
        snapshot.docs.map((doc) => {
          const post = doc.data() as Post;
          return [post.id, post];
        }),
      );
      mergeAndDispatch();
    });
  });

  return () => {
    unsubscribes.forEach((unsub) => unsub());
  };
};
