import { AppDispatch } from '@/store';
import { setChannels } from '@/store/slices/channelsSlice';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Channel } from './channel.types';

export const subscribeToChannels = () => (dispatch: AppDispatch) => {
  const unsubscribe = onSnapshot(collection(db, 'channels'), (snapshot) => {
    const channels = snapshot.docs.map((doc) => doc.data() as Channel);
    dispatch(setChannels(channels));
  });

  return unsubscribe;
};
