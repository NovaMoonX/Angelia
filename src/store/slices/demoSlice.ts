import { createSlice } from '@reduxjs/toolkit';
import { resetAllState } from '@store/actions/globalActions';

interface DemoState {
  isActive: boolean;
}

const initialState: DemoState = {
  isActive: false,
};

const demoSlice = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    enterDemoMode: (state) => {
      state.isActive = true;
    },
    exitDemoMode: (state) => {
      state.isActive = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => initialState);
  },
});

export const { enterDemoMode, exitDemoMode } = demoSlice.actions;
export default demoSlice.reducer;
