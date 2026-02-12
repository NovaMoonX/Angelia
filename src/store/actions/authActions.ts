import { createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@lib/firebase';
import { type User } from '@lib/mockData';
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
  async (
    {
      id,
      email,
      firstName,
      lastName,
      funFact,
      avatar,
    }: Omit<User,'joinedAt' | 'accountProgress'>,
    { dispatch },
  ) => {
    const newUser: User = {
      id,
      email,
      firstName,
      lastName,
      funFact,
      avatar,
      joinedAt: Date.now(),
      accountProgress: {
        emailVerified: false,
        signUpComplete: true,
        dailyChannelCreated: false,
      },
    };
    try {
      // Save user profile to Firestore
      const userDocRef = doc(db, 'users', id);
      await setDoc(userDocRef, {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        funFact: newUser.funFact,
        avatar: newUser.avatar,
        accountProgress: newUser.accountProgress,
        joinedAt: newUser.joinedAt,
      });

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
export const syncEmailVerified = createAsyncThunk(
  'auth/syncEmailVerified',
  async (
    { uid, emailVerified }: { uid: string; emailVerified: boolean },
    { dispatch },
  ) => {
    try {
      const userDocRef = doc(db, 'users', uid);

      // Update emailVerified in Firestore
      await updateDoc(userDocRef, {
        'accountProgress.emailVerified': emailVerified,
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
      console.error('Error syncing email verified status:', err);
      throw err;
    }

    return null;
  },
);
