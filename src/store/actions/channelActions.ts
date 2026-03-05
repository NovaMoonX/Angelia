import { User } from '@/lib/user';
import generateId from '@/util/generateId';
import {
  Channel,
  ChannelJoinRequest,
  CUSTOM_CHANNEL_LIMIT,
  DAILY_CHANNEL_DESCRIPTION,
  NewChannel,
} from '@lib/channel';
import { db } from '@lib/firebase';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { RootState } from '..';
import { updateAccountProgress } from './userActions';

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
      const channelSnap = await getDoc(channelDocRef);
      if (channelSnap.exists()) {
        const data = channelSnap.data() as Channel;
        // If the daily channel is marked for deletion, treat it as missing
        // and recreate/unmark it via createDailyChannel so the owner keeps
        // their daily channel.
        if (data.markedForDeletionAt) {
          await dispatch(createDailyChannel(userId));
          return;
        }

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
  async (userId: string) => {
    try {
      const channelId = `${userId}-daily`;
      const channelDocRef = doc(db, 'channels', channelId);

      // Check Firestore first to avoid overwriting
      const channelSnap = await getDoc(channelDocRef);
      if (channelSnap.exists()) {
        const existing = channelSnap.data() as Channel;
        // If the existing daily channel was previously marked for deletion,
        // clear the flag so the owner retains their daily channel.
        if (existing.markedForDeletionAt) {
          await updateDoc(channelDocRef, { markedForDeletionAt: null });
          const refreshed = (await getDoc(channelDocRef)).data() as Channel;
          return refreshed;
        }

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
        markedForDeletionAt: null,
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
        markedForDeletionAt: null,
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

        const userData = userSnap.data() as User;
        const current =
          typeof userData.customChannelCount === 'number'
            ? userData.customChannelCount
            : 0;
        if (current >= CUSTOM_CHANNEL_LIMIT) {
          throw new Error('Maximum custom channels reached.');
        }

        const channelSnap = await tx.get(channelDocRef);
        if (channelSnap.exists()) {
          const ch = channelSnap.data() as Channel;
          if (!ch.markedForDeletionAt) {
            throw new Error('Channel already exists');
          }
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
        id: __id,
        ownerId: __ownerId,
        isDaily: __isDaily,
        createdAt: __createdAt,
        inviteCode: __inviteCode,
        subscribers: __subscribers,
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

        const channel = channelSnap.data() as Channel;
        if (channel.isDaily) {
          throw new Error('Daily channels cannot be deleted');
        }

        if (channel.markedForDeletionAt) {
          throw new Error('Channel is already marked for deletion');
        }

        const ownerId = channel.ownerId;
        const userDocRef = doc(db, 'users', ownerId);
        const userSnap = await tx.get(userDocRef);
        if (!userSnap.exists()) {
          throw new Error('Owner user not found');
        }

        const userData = userSnap.data() as User;
        const current =
          typeof userData.customChannelCount === 'number'
            ? userData.customChannelCount
            : 0;
        const newCount = Math.max(0, current - 1);

        // Instead of deleting immediately, mark the channel for deletion.
        // This allows for a grace period / possible undo before actual removal.
        tx.update(channelDocRef, { markedForDeletionAt: Date.now() });
        tx.update(userDocRef, { customChannelCount: newCount });
      });

      return channelId;
    } catch (err) {
      console.error('Error deleting channel:', err);
      throw err;
    }
  },
);

/**
 * Submit a join request for a channel via invite URL.
 * Verifies the inviteCode matches the channel before creating the request.
 */
export const createJoinRequest = createAsyncThunk(
  'channels/createJoinRequest',
  async (
    {
      channelId,
      inviteCode,
      message,
    }: { channelId: string; inviteCode: string; message: string },
    { getState },
  ) => {
    try {
      const state = getState() as RootState;
      const requesterId = state.users.currentUser?.id;
      if (!requesterId)
        throw new Error('You must be signed in to request to join.');

      const channelDocRef = doc(db, 'channels', channelId);
      const channelSnap = await getDoc(channelDocRef);
      if (!channelSnap.exists()) throw new Error('Channel not found.');

      const channel = channelSnap.data() as Channel;
      if (channel.inviteCode !== inviteCode)
        throw new Error('Invalid invite link.');
      if (channel.subscribers.includes(requesterId))
        throw new Error('You are already subscribed to this channel.');

      // Check for an existing pending request
      const existingQ = query(
        collection(db, 'channelJoinRequests'),
        where('channelId', '==', channelId),
        where('requesterId', '==', requesterId),
        where('status', '==', 'pending'),
      );
      const existingSnap = await getDocs(existingQ);
      if (!existingSnap.empty)
        throw new Error('You already have a pending request for this channel.');

      const requestId = generateId('joinRequest');
      const joinRequest: ChannelJoinRequest = {
        id: requestId,
        channelId,
        channelOwnerId: channel.ownerId,
        requesterId,
        message,
        status: 'pending',
        createdAt: Date.now(),
        respondedAt: null,
      };

      await setDoc(doc(db, 'channelJoinRequests', requestId), joinRequest);
      return joinRequest;
    } catch (err) {
      console.error('Error creating join request:', err);
      throw err;
    }
  },
);

/**
 * Remove the current user from a channel's subscribers list.
 */
export const unsubscribeFromChannel = createAsyncThunk(
  'channels/unsubscribe',
  async (channelId: string, { getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.users.currentUser?.id;
      if (!userId) throw new Error('You must be signed in to unsubscribe.');

      const channelDocRef = doc(db, 'channels', channelId);

      await runTransaction(db, async (tx) => {
        const channelSnap = await tx.get(channelDocRef);
        if (!channelSnap.exists()) throw new Error('Channel not found.');

        const channel = channelSnap.data() as Channel;
        if (!channel.subscribers.includes(userId)) {
          throw new Error('You are not subscribed to this channel.');
        }

        tx.update(channelDocRef, {
          subscribers: channel.subscribers.filter((id) => id !== userId),
        });
      });

      return channelId;
    } catch (err) {
      console.error('Error unsubscribing from channel:', err);
      throw err;
    }
  },
);

/**
 * Generate a new invite code for a channel. Only the owner should call this.
 */
export const refreshChannelInviteCode = createAsyncThunk(
  'channels/refreshInviteCode',
  async (channelId: string, { getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.users.currentUser?.id;
      if (!userId) throw new Error('You must be signed in.');

      const newInviteCode = generateId('channelInviteCode');
      const channelDocRef = doc(db, 'channels', channelId);

      await runTransaction(db, async (tx) => {
        const channelSnap = await tx.get(channelDocRef);
        if (!channelSnap.exists()) throw new Error('Channel not found.');

        const channel = channelSnap.data() as Channel;
        if (channel.ownerId !== userId)
          throw new Error('Only the channel owner can refresh the invite code.');

        tx.update(channelDocRef, { inviteCode: newInviteCode });
      });

      return { channelId, inviteCode: newInviteCode };
    } catch (err) {
      console.error('Error refreshing channel invite code:', err);
      throw err;
    }
  },
);

/**
 * Accept or decline a join request. Only the channel owner should call this.
 * When accepted, the requester is added to the channel's subscribers list.
 */
export const respondToJoinRequest = createAsyncThunk(
  'channels/respondToJoinRequest',
  async ({ requestId, accept }: { requestId: string; accept: boolean }) => {
    try {
      const requestDocRef = doc(db, 'channelJoinRequests', requestId);
      const requestSnap = await getDoc(requestDocRef);
      if (!requestSnap.exists()) throw new Error('Join request not found.');

      const joinRequest = requestSnap.data() as ChannelJoinRequest;
      const channelDocRef = doc(db, 'channels', joinRequest.channelId);
      const now = Date.now();

      await runTransaction(db, async (tx) => {
        const channelSnap = await tx.get(channelDocRef);

        if (accept) {
          if (!channelSnap.exists()) throw new Error('Channel not found.');
          const channel = channelSnap.data() as Channel;
          if (!channel.subscribers.includes(joinRequest.requesterId)) {
            tx.update(channelDocRef, {
              subscribers: [...channel.subscribers, joinRequest.requesterId],
            });
          }
        }

        const status = accept ? 'accepted' : 'declined';
        tx.update(requestDocRef, { status, respondedAt: now });
      });

      return { requestId, accept, respondedAt: now };
    } catch (err) {
      console.error('Error responding to join request:', err);
      throw err;
    }
  },
);
