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
}

export type NewUser = Omit<User,'joinedAt' | 'accountProgress' | 'customChannelCount'>