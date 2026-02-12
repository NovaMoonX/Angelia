import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Channel } from '@lib/channel';
import { addChannel } from '../slices/channelsSlice';

/**
 * Check whether a user's daily channel exists. This will consult local Redux
 * state first and then Firestore. If found in Firestore, it will dispatch
 * `addChannel` to ensure local state is populated.
 */
export const checkDailyChannelExists = createAsyncThunk(
  'channels/checkDailyExists',
  async (userId: string, { dispatch, getState }) => {
    try {
      const state = getState() as any;
      const channels: Channel[] = state.channels?.items || [];

      const existing = channels.find((ch) => ch.ownerId === userId && ch.isDaily);
      if (existing) return existing;

      const channelId = `${userId}-daily`;
      const channelDocRef = doc(db, 'channels', channelId);
      const channelSnap = await getDoc(channelDocRef as any);

      if (channelSnap.exists()) {
        const data = channelSnap.data() as Channel;
        dispatch(addChannel(data));
        return data;
      }

      return null;
    } catch (err) {
      console.error('Error checking daily channel:', err);
      throw err;
    }
  },
);

/**
 * Create a daily channel for the given user. If a channel already exists in
 * Firestore, it will return the existing channel instead of overwriting.
 */
export const createDailyChannel = createAsyncThunk(
  'channels/createDaily',
  async (userId: string, { dispatch }) => {
    try {
      const channelId = `${userId}-daily`;
      const channelDocRef = doc(db, 'channels', channelId);

      // Check Firestore first to avoid overwriting
      const channelSnap = await getDoc(channelDocRef as any);
      if (channelSnap.exists()) {
        const existing = channelSnap.data() as Channel;
        dispatch(addChannel(existing));
        return existing;
      }

      const newChannel: Channel = {
        id: channelId,
        name: 'Daily',
        color: 'INDIGO',
        isDaily: true,
        ownerId: userId,
        subscribers: [userId],
        inviteCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      };

      await setDoc(channelDocRef, newChannel);
      dispatch(addChannel(newChannel));
      return newChannel;
    } catch (err) {
      console.error('Error creating daily channel:', err);
      throw err;
    }
  },
);
