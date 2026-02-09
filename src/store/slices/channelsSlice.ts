import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Channel, mockChannels } from '@lib/mockData';

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
      const index = state.items.findIndex(ch => ch.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeChannel: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(ch => ch.id !== action.payload);
    },
    clearChannels: (state) => {
      state.items = [];
    },
    loadDemoChannels: (state) => {
      state.items = mockChannels;
    },
  },
});

export const { 
  setChannels, 
  addChannel, 
  updateChannel, 
  removeChannel, 
  clearChannels, 
  loadDemoChannels 
} = channelsSlice.actions;
export default channelsSlice.reducer;
