import { AppDispatch } from '@/store';
import { setPosts } from '@/store/slices/postsSlice';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Post } from './post.types';

export const subscribeToPosts = () => (dispatch: AppDispatch) => {
  // Exclude posts marked for deletion
  const q = query(
    collection(db, 'posts'),
    where('markedForDeletionAt', '==', null),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const posts = snapshot.docs.map((doc) => doc.data() as Post);
    dispatch(setPosts(posts));
  });

  return unsubscribe;
};
