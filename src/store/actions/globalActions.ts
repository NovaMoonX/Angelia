import { createAction } from '@reduxjs/toolkit';

/**
 * Global action to reset all Redux state to initial values.
 * This action is handled by all slices to clear their respective state.
 * 
 * Use this when:
 * - User signs out
 * - Clearing demo mode
 * - Resetting the application to a clean state
 */
export const resetAllState = createAction('RESET_ALL_STATE');
