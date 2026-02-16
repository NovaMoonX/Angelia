import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { Channel, CUSTOM_CHANNEL_LIMIT, DAILY_CHANNEL_DESCRIPTION, NewChannel } from '@lib/channel';
import { addChannel } from '../slices/channelsSlice';
import { RootState } from '..';
import { updateAccountProgress } from './authActions';
import generateId from '@/util/generateId';

/**
 * Check whether a user's daily channel exists. This will consult local Redux
 * state first and then Firestore. If found in Firestore, it will dispatch
 * `addChannel` to ensure local state is populated.
 */
export const ensureDailyChannelExists = createAsyncThunk(
  'channels/checkDailyExists',
  async (userId: string, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;

      const user = state.users?.currentUser;

      if (user?.accountProgress?.dailyChannelCreated) {
        return;
      }

      const channels: Channel[] = state.channels?.items || [];

      const existingDailyChannel = channels.find((ch) => ch.ownerId === userId && ch.isDaily);
      if (existingDailyChannel) {
        await dispatch(updateAccountProgress({
          uid: userId,
          field: 'dailyChannelCreated',
          value: true,
        }));
        return;
      }

      const channelId = `${userId}-daily`;
      const channelDocRef = doc(db, 'channels', channelId);
      const channelSnap = await getDoc(channelDocRef as any);

      if (channelSnap.exists()) {
        const data = channelSnap.data() as Channel;
        dispatch(addChannel(data));
        await dispatch(updateAccountProgress({
          uid: userId,
          field: 'dailyChannelCreated',
          value: true,
        }));
        return;
      }

      await dispatch(createDailyChannel(userId));
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
        description: DAILY_CHANNEL_DESCRIPTION,
        color: 'INDIGO',
        isDaily: true,
        ownerId: userId,
        subscribers: [],
        inviteCode: generateId('channelInviteCode'),
        createdAt: Date.now(),
      };

      await setDoc(channelDocRef, newChannel);
      return newChannel;
    } catch (err) {
      console.error('Error creating daily channel:', err);
      throw err;
    }
  },
);

export const createCustomChannel = createAsyncThunk(
  'channels/createCustomChannel',
  async (channel: NewChannel, { getState }) => {
    try {
      const state = getState() as RootState;
      const user = state.users?.currentUser;

      if (!user) {
        throw new Error('User not found');
      }

      // Check if user has reached channel limit
      const userOwnedChannels = state.channels?.items.filter((ch) => ch.ownerId === user.id && !ch.isDaily) || [];
      if (userOwnedChannels.length >= CUSTOM_CHANNEL_LIMIT) {
        throw new Error('Maximum custom channels reached.');
      }

      const channelId = generateId('channel')
      const channelDocRef = doc(db, 'channels', channelId);

      const newChannel: Channel = {
        ...channel,
        id: channelId,
        isDaily: false,
        inviteCode: generateId('channelInviteCode'),
        createdAt: Date.now(),
      }

      await setDoc(channelDocRef, newChannel);
      return newChannel;
    } catch (err) {
      console.error('Error creating channel:', err);
      throw err;
    }
  },
);
