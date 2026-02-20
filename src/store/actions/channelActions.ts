import generateId from '@/util/generateId';
import {
  Channel,
  CUSTOM_CHANNEL_LIMIT,
  DAILY_CHANNEL_DESCRIPTION,
  NewChannel,
} from '@lib/channel';
import { db } from '@lib/firebase';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  doc,
  getDoc,
  runTransaction,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { RootState } from '..';
import { addChannel } from '../slices/channelsSlice';
import { updateAccountProgress } from './authActions';

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

      const existingDailyChannel = channels.find(
        (ch) => ch.ownerId === userId && ch.isDaily,
      );
      if (existingDailyChannel) {
        await dispatch(
          updateAccountProgress({
            uid: userId,
            field: 'dailyChannelCreated',
            value: true,
          }),
        );
        return;
      }

      const channelId = `${userId}-daily`;
      const channelDocRef = doc(db, 'channels', channelId);
      const channelSnap = await getDoc(channelDocRef as any);

      if (channelSnap.exists()) {
        const data = channelSnap.data() as Channel;
        dispatch(addChannel(data));
        await dispatch(
          updateAccountProgress({
            uid: userId,
            field: 'dailyChannelCreated',
            value: true,
          }),
        );
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

      const channelId = generateId('channel');
      const channelDocRef = doc(db, 'channels', channelId);

      const newChannel: Channel = {
        ...channel,
        id: channelId,
        isDaily: false,
        inviteCode: generateId('channelInviteCode'),
        createdAt: Date.now(),
      };

      // Transaction: ensure user's customChannelCount is below limit,
      // ensure channel does not already exist, then create channel and
      // increment the user's customChannelCount atomically.
      await runTransaction(db, async (tx) => {
        const userDocRef = doc(db, 'users', user.id);
        const userSnap = await tx.get(userDocRef);
        if (!userSnap.exists()) {
          throw new Error('User profile not found');
        }

        const userData = userSnap.data() as any;
        const current =
          typeof userData.customChannelCount === 'number'
            ? userData.customChannelCount
            : 0;
        if (current >= CUSTOM_CHANNEL_LIMIT) {
          throw new Error('Maximum custom channels reached.');
        }

        const channelSnap = await tx.get(channelDocRef);
        if (channelSnap.exists()) {
          throw new Error('Channel already exists');
        }

        tx.set(channelDocRef, newChannel);
        tx.update(userDocRef, { customChannelCount: current + 1 });
      });

      return newChannel;
    } catch (err) {
      console.error('Error creating channel:', err);
      throw err;
    }
  },
);

/**
 * Update a custom channel in Firestore. Only the owner should call this.
 */
export const updateCustomChannel = createAsyncThunk(
  'channels/updateCustom',
  async (channel: Channel) => {
    try {
      const channelDocRef = doc(db, 'channels', channel.id);

      // Prepare update payload - do not allow changing id or ownerId
      const {
        id,
        ownerId,
        isDaily,
        createdAt,
        inviteCode,
        subscribers,
        ...updatable
      } = channel;

      await updateDoc(channelDocRef, updatable);

      return channel;
    } catch (err) {
      console.error('Error updating channel:', err);
      throw err;
    }
  },
);

/**
 * Delete a custom (non-daily) channel. Only the owner may delete.
 */
export const deleteCustomChannel = createAsyncThunk(
  'channels/deleteCustom',
  async (channelId: string) => {
    try {
      const channelDocRef = doc(db, 'channels', channelId);
      // Transaction: delete channel and decrement owner's customChannelCount
      await runTransaction(db, async (tx) => {
        const channelSnap = await tx.get(channelDocRef);
        if (!channelSnap.exists()) {
          throw new Error('Channel not found');
        }

        const channel = channelSnap.data() as any;
        if (channel.isDaily) {
          throw new Error('Daily channels cannot be deleted');
        }

        const ownerId = channel.ownerId;
        const userDocRef = doc(db, 'users', ownerId);
        const userSnap = await tx.get(userDocRef);
        if (!userSnap.exists()) {
          throw new Error('Owner user not found');
        }

        const userData = userSnap.data() as any;
        const current =
          typeof userData.customChannelCount === 'number'
            ? userData.customChannelCount
            : 0;
        const newCount = Math.max(0, current - 1);

        tx.delete(channelDocRef);
        tx.update(userDocRef, { customChannelCount: newCount });
      });

      // Return the deleted channel id; callers may update local state.
      return channelId;
    } catch (err) {
      console.error('Error deleting channel:', err);
      throw err;
    }
  },
);
