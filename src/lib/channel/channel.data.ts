import { AppDispatch } from '@/store';
import { setChannels } from '@/store/slices/channelsSlice';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Channel } from './channel.types';

export const subscribeToChannels = () => (dispatch: AppDispatch) => {
  // Exclude channels marked for deletion
  const q = query(
    collection(db, 'channels'),
    where('markedForDeletionAt', '==', null),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const channels = snapshot.docs.map((doc) => doc.data() as Channel);
    dispatch(setChannels(channels));
  });

  return unsubscribe;
};
