import { AppDispatch } from '@/store';
import { setCurrentUser } from '@/store/slices/usersSlice';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from './user.types';

export const subscribeToCurrentUser =
  (uid: string) => (dispatch: AppDispatch) => {
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

/** Fetch a single user document by ID. Used for the invite page. */
export const fetchUserById = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, 'users', userId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as User;
};
