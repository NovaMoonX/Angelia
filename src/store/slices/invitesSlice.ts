import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChannelJoinRequest, mockJoinRequests } from '@lib/channel';
import { resetAllState } from '@store/actions/globalActions';

interface InvitesState {
  /** Join requests sent to channels the current user owns */
  incoming: ChannelJoinRequest[];
  /** Join requests the current user has sent to other channels */
  outgoing: ChannelJoinRequest[];
}

const initialState: InvitesState = {
  incoming: [],
  outgoing: [],
};

const invitesSlice = createSlice({
  name: 'invites',
  initialState,
  reducers: {
    setIncomingRequests: (state, action: PayloadAction<ChannelJoinRequest[]>) => {
      state.incoming = action.payload;
    },
    setOutgoingRequests: (state, action: PayloadAction<ChannelJoinRequest[]>) => {
      state.outgoing = action.payload;
    },
    updateJoinRequest: (state, action: PayloadAction<ChannelJoinRequest>) => {
      const inIdx = state.incoming.findIndex((r) => r.id === action.payload.id);
      if (inIdx !== -1) {
        state.incoming[inIdx] = action.payload;
        return;
      }
      const outIdx = state.outgoing.findIndex((r) => r.id === action.payload.id);
      if (outIdx !== -1) {
        state.outgoing[outIdx] = action.payload;
      }
    },
    clearInvites: (state) => {
      state.incoming = [];
      state.outgoing = [];
    },
    loadDemoInvites: (state) => {
      const currentUserId = 'currentUser';
      state.incoming = mockJoinRequests.filter((r) => r.channelOwnerId === currentUserId);
      state.outgoing = mockJoinRequests.filter((r) => r.requesterId === currentUserId);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => initialState);
  },
});

export const {
  setIncomingRequests,
  setOutgoingRequests,
  updateJoinRequest,
  clearInvites,
  loadDemoInvites,
} = invitesSlice.actions;
export default invitesSlice.reducer;
