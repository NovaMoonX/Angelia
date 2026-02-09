import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tiding, mockTidings } from '@lib/mockData';

interface TidingsState {
  items: Tiding[];
}

const initialState: TidingsState = {
  items: [],
};

const tidingsSlice = createSlice({
  name: 'tidings',
  initialState,
  reducers: {
    setTidings: (state, action: PayloadAction<Tiding[]>) => {
      state.items = action.payload;
    },
    addTiding: (state, action: PayloadAction<Tiding>) => {
      state.items.unshift(action.payload);
    },
    clearTidings: (state) => {
      state.items = [];
    },
    loadDemoTidings: (state) => {
      state.items = mockTidings;
    },
  },
});

export const { setTidings, addTiding, clearTidings, loadDemoTidings } = tidingsSlice.actions;
export default tidingsSlice.reducer;
