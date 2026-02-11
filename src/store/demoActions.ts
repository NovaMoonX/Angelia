import { createAsyncThunk } from '@reduxjs/toolkit';
import { enterDemoMode as enterDemoModeAction, exitDemoMode as exitDemoModeAction } from './slices/demoSlice';
import { loadDemoTidings, clearTidings } from './slices/tidingsSlice';
import { loadDemoChannels, clearChannels } from './slices/channelsSlice';
import { loadDemoUsers, clearUsers } from './slices/usersSlice';
import { loadDemoInvites, clearInvites } from './slices/invitesSlice';
import { resetAllState } from './globalActions';

// Thunk to enter demo mode - loads all demo data
export const enterDemoMode = createAsyncThunk(
  'demo/enter',
  async (_, { dispatch }) => {
    // First, clear any existing data
    dispatch(clearTidings());
    dispatch(clearChannels());
    dispatch(clearUsers());
    dispatch(clearInvites());
    
    // Then load demo data
    dispatch(loadDemoTidings());
    dispatch(loadDemoChannels());
    dispatch(loadDemoUsers());
    dispatch(loadDemoInvites());
    
    // Finally, activate demo mode
    dispatch(enterDemoModeAction());
  }
);

// Thunk to exit demo mode - clears all demo data
export const exitDemoMode = createAsyncThunk(
  'demo/exit',
  async (_, { dispatch }) => {
    // Exit demo mode and clear all state using global reset
    dispatch(exitDemoModeAction());
    dispatch(resetAllState());
  }
);

/**
 * Example usage of resetAllState:
 * 
 * // In any component with dispatch:
 * import { resetAllState } from '@store/index';
 * 
 * const handleSignOut = async () => {
 *   await signOut(); // Firebase sign out
 *   dispatch(resetAllState()); // Clear all Redux state
 *   navigate('/auth');
 * };
 */
