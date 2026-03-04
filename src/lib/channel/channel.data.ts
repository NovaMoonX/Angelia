import { AppDispatch } from '@/store';
import { setChannels } from '@/store/slices/channelsSlice';
import { setIncomingRequests, setOutgoingRequests } from '@/store/slices/invitesSlice';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Channel } from './channel.types';
import { ChannelJoinRequest } from './channel.types';

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

/** Fetch a single channel document by ID. Used for the invite page. */
export const fetchChannelById = async (channelId: string): Promise<Channel | null> => {
  const docRef = doc(db, 'channels', channelId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return snap.data() as Channel;
};

/** Listen to all pending join requests sent to channels owned by uid. */
export const subscribeToIncomingJoinRequests = (uid: string) => (dispatch: AppDispatch) => {
  const q = query(
    collection(db, 'channelJoinRequests'),
    where('channelOwnerId', '==', uid),
    where('status', '==', 'pending'),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((d) => d.data() as ChannelJoinRequest);
    dispatch(setIncomingRequests(requests));
  });

  return unsubscribe;
};

/** Listen to all join requests submitted by uid. */
export const subscribeToOutgoingJoinRequests = (uid: string) => (dispatch: AppDispatch) => {
  const q = query(
    collection(db, 'channelJoinRequests'),
    where('requesterId', '==', uid),
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((d) => d.data() as ChannelJoinRequest);
    dispatch(setOutgoingRequests(requests));
  });

  return unsubscribe;
};
