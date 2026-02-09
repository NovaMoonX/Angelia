import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserInvite, mockUserInvites } from '@lib/mockData';

interface InvitesState {
  items: UserInvite[];
}

const initialState: InvitesState = {
  items: [],
};

const invitesSlice = createSlice({
  name: 'invites',
  initialState,
  reducers: {
    setInvites: (state, action: PayloadAction<UserInvite[]>) => {
      state.items = action.payload;
    },
    updateInvite: (state, action: PayloadAction<UserInvite>) => {
      const index = state.items.findIndex(inv => inv.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    clearInvites: (state) => {
      state.items = [];
    },
    loadDemoInvites: (state) => {
      state.items = mockUserInvites;
    },
  },
});

export const { 
  setInvites, 
  updateInvite, 
  clearInvites, 
  loadDemoInvites 
} = invitesSlice.actions;
export default invitesSlice.reducer;
