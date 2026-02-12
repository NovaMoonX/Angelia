import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, mockCurrentUser, mockUsers } from '@lib/mockData';
import { resetAllState } from '@store/actions/globalActions';

interface UsersState {
  currentUser: User | null;
  users: User[];
}

const initialState: UsersState = {
  currentUser: null,
  users: [],
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearUsers: (state) => {
      state.currentUser = null;
      state.users = [];
    },
    loadDemoUsers: (state) => {
      state.currentUser = mockCurrentUser;
      state.users = mockUsers;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => initialState);
  },
});

export const { 
  setCurrentUser, 
  setUsers, 
  updateCurrentUser, 
  clearUsers, 
  loadDemoUsers 
} = usersSlice.actions;
export default usersSlice.reducer;
