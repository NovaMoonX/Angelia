import { AppDispatch } from '@/store';
import { setChannels } from '@/store/slices/channelsSlice';
import { setIncomingRequests, setOutgoingRequests } from '@/store/slices/invitesSlice';
import { and, collection, doc, getDoc, onSnapshot, or, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { Channel } from './channel.types';
import { ChannelJoinRequest } from './channel.types';

/** Subscribe to channels the user owns or is subscribed to (excludes deleted channels). */
export const subscribeToChannels = (uid: string) => (dispatch: AppDispatch) => {
  const q = query(
    collection(db, 'channels'),
    and(
      where('markedForDeletionAt', '==', null),
      or(
        where('ownerId', '==', uid),
        where('subscribers', 'array-contains', uid),
      ),
    ),
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

/** Listen to all join requests sent to channels owned by uid (all statuses). */
export const subscribeToIncomingJoinRequests = (uid: string) => (dispatch: AppDispatch) => {
  const q = query(
    collection(db, 'channelJoinRequests'),
    where('channelOwnerId', '==', uid),
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
