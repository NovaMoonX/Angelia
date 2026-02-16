import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { NewUser, type User } from '@lib/user';
import { setCurrentUser } from '../slices/usersSlice';

/**
 * Async thunk to fetch user profile from Firestore and set in Redux
 */
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (uid: string, { dispatch }) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as Omit<User, 'id'>;
        const user: User = {
          id: uid,
          ...userData,
        };
        dispatch(setCurrentUser(user));
        return user;
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      throw err;
    }

    return null;
  },
);

/**
 * Async thunk to create and save user profile to Firestore
 */
export const createUserProfile = createAsyncThunk(
  'auth/createUserProfile',
  async (user: NewUser, { dispatch }) => {
    const newUser: User = {
      ...user,
      joinedAt: Date.now(),
      accountProgress: {
        emailVerified: false,
        signUpComplete: true,
        dailyChannelCreated: false,
      },
      customChannelCount: 0,
    };
    try {
      // Save user profile to Firestore
      const userDocRef = doc(db, 'users', newUser.id);
      await setDoc(userDocRef, newUser);

      // Set the user profile in Redux
      dispatch(setCurrentUser(newUser));
      return newUser;
    } catch (err) {
      console.error('Error creating user profile:', err);
      throw err;
    }
  },
);

/**
 * Async thunk to sync emailVerified status from Firebase Auth to Firestore
 */
export const updateAccountProgress = createAsyncThunk(
  'auth/accountProgress',
  async (
    {
      uid,
      field,
      value,
    }: { uid: string; field: keyof User['accountProgress']; value: boolean },
    { dispatch },
  ) => {
    try {
      const userDocRef = doc(db, 'users', uid);

      // Update the specified field in Firestore
      await updateDoc(userDocRef, {
        [`accountProgress.${field}`]: value,
      });

      // Fetch and update the user profile in Redux
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data() as Omit<User, 'id'>;
        const user: User = {
          id: uid,
          ...userData,
        };
        dispatch(setCurrentUser(user));
        return user;
      }
    } catch (err) {
      console.error(`Error updating account progress (${field}):`, err);
      throw err;
    }

    return null;
  },
);
