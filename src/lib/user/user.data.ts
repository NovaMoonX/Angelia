import { AppDispatch } from '@/store';
import { setCurrentUser, setUsers } from '@/store/slices/usersSlice';
import { collection, doc, documentId, getDoc, onSnapshot, query, where } from 'firebase/firestore';
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

// Firestore 'in' operator supports a maximum of 30 values per query.
const USER_BATCH_SIZE = 30;

/**
 * Subscribe to the profiles of channel-related users (subscribers and owners).
 * This ensures post authors resolve to real names instead of "Unknown User".
 *
 * Pass all user IDs gathered from the current user's accessible channels
 * (owners of subscribed channels + subscribers of owned channels), excluding
 * the current user whose profile is already tracked by subscribeToCurrentUser.
 *
 * When userIds exceeds 30 (Firestore's 'in' limit), multiple listeners are
 * created and their results are merged before dispatching to Redux.
 */
export const subscribeToChannelUsers =
  (userIds: string[]) => (dispatch: AppDispatch) => {
    if (userIds.length === 0) {
      return () => {};
    }

    // Split into chunks to stay within Firestore's 'in' limit
    const chunks: string[][] = [];
    for (let i = 0; i < userIds.length; i += USER_BATCH_SIZE) {
      chunks.push(userIds.slice(i, i + USER_BATCH_SIZE));
    }

    const batchResults: Map<string, User>[] = chunks.map(() => new Map());

    const mergeAndDispatch = () => {
      const merged = new Map<string, User>();
      batchResults.forEach((batch) =>
        batch.forEach((user, id) => merged.set(id, user)),
      );
      dispatch(setUsers(Array.from(merged.values())));
    };

    const unsubscribes = chunks.map((chunk, index) => {
      const q = query(
        collection(db, 'users'),
        where(documentId(), 'in', chunk),
      );

      return onSnapshot(q, (snapshot) => {
        batchResults[index] = new Map(
          snapshot.docs.map((docSnap) => {
            const user: User = { id: docSnap.id, ...docSnap.data() } as User;
            return [user.id, user];
          }),
        );
        mergeAndDispatch();
      });
    });

    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  };
