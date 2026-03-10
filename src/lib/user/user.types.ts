import { AvatarPreset } from '../app';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  funFact: string;
  avatar: AvatarPreset;
  joinedAt: number; // Unix timestamp in ms
  accountProgress: {
    signUpComplete: boolean;
    emailVerified: boolean;
    dailyChannelCreated: boolean;
  },
  customChannelCount: number;
  /** FCM registration token for push notifications. Null when not registered. */
  fcmToken: string | null;
}

export type NewUser = Omit<User,'joinedAt' | 'accountProgress' | 'customChannelCount' | 'fcmToken'>
export type UpdateUserProfileData = Pick<User, 'firstName' | 'lastName' | 'funFact' | 'avatar'>;