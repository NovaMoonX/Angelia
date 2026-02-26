import { AppDispatch } from '@/store';
import { setCurrentUser } from '@/store/slices/usersSlice';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from './user.types';

export const subscribeToCurrentUser = (uid: string) => (dispatch: AppDispatch) => {
  const docRef = doc(db, 'users', uid);

  const unsubscribe = onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      dispatch(setCurrentUser(null));
      return;
    }

    const data = snapshot.data() as Omit<User, 'id'>;
    const user: User = {
      id: uid,
      ...data,
    };

    dispatch(setCurrentUser(user));
  });

  return unsubscribe;
};
