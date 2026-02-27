import { Channel, mockChannels } from '@lib/channel';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetAllState } from '@store/actions/globalActions';
import { RootState } from '..';

interface ChannelsState {
  items: Channel[];
}

const initialState: ChannelsState = {
  items: [],
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setChannels: (state, action: PayloadAction<Channel[]>) => {
      state.items = action.payload;
    },
    addChannel: (state, action: PayloadAction<Channel>) => {
      state.items.push(action.payload);
    },
    updateChannel: (state, action: PayloadAction<Channel>) => {
      const index = state.items.findIndex((ch) => ch.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeChannel: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((ch) => ch.id !== action.payload);
    },
    clearChannels: (state) => {
      state.items = [];
    },
    loadDemoChannels: (state) => {
      state.items = mockChannels;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => initialState);
  },
});

export const {
  setChannels,
  addChannel,
  updateChannel,
  removeChannel,
  clearChannels,
  loadDemoChannels,
} = channelsSlice.actions;
export default channelsSlice.reducer;

// Selectors
export const selectUserChannels = createSelector(
  [
    (state: { channels: ChannelsState }) => state.channels.items,
    (state: RootState) => state.users?.currentUser?.id,
  ],
  (channels, userId) => {
    if (!userId) return [];
    return channels.filter((channel) => channel.ownerId === userId);
  },
);

export const selectUserDailyChannel = createSelector(
  [selectUserChannels],
  (userChannels) => userChannels.find((ch) => ch.isDaily) || null,
);

export const selectChannelMapById = createSelector(
  (state: { channels: ChannelsState }) => state.channels.items,
  (channels) => {
    const map = channels.reduce(
      (acc, ch) => {
        acc[ch.id] = ch;
        return acc;
      },
      {} as Record<string, Channel>,
    );
    return map;
  },
);

export const selectChannelById = createSelector(
  [selectChannelMapById, (_: any, channelId: string) => channelId],
  (channelMap, channelId) => channelMap[channelId] || null,
);
