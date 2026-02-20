import { User } from './user.types';

// Mock current user data
export const mockCurrentUser: User = {
  id: 'currentUser',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@example.com',
  funFact: 'Coffee enthusiast ☕ | Book lover 📚 | Weekend hiker 🥾 | Always up for trying new recipes',
  avatar: 'galaxy',
  joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 180, // 180 days ago (~6 months)
  accountProgress: {
    signUpComplete: true,
    emailVerified: true,
    dailyChannelCreated: true,
  },
  customChannelCount: 2,
};

// Mock users database
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    funFact: 'Love hiking and photography',
    avatar: 'cosmic-cat',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 200,
    accountProgress: {
      signUpComplete: true,
      emailVerified: true,
      dailyChannelCreated: true,
    },
    customChannelCount: 1,
  },
  {
    id: 'user2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@example.com',
    funFact: 'Amateur chef and food lover',
    avatar: 'rocket',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 150,
    accountProgress: {
      signUpComplete: true,
      emailVerified: true,
      dailyChannelCreated: true,
    },
    customChannelCount: 0,
  },
  {
    id: 'user3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@example.com',
    funFact: 'Graduate student and bookworm',
    avatar: 'star',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
    accountProgress: {
      signUpComplete: true,
      emailVerified: true,
      dailyChannelCreated: true,
    },
    customChannelCount: 3,
  },
  {
    id: 'user4',
    firstName: 'David',
    lastName: 'Park',
    email: 'david.park@example.com',
    funFact: 'DIY enthusiast and builder',
    avatar: 'planet',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 190,
    accountProgress: {
      signUpComplete: true,
      emailVerified: true,
      dailyChannelCreated: true,
    },
    customChannelCount: 2,
  },
  {
    id: 'user5',
    firstName: 'Lisa',
    lastName: 'Thompson',
    email: 'lisa.thompson@example.com',
    funFact: 'Beach lover and travel enthusiast',
    avatar: 'nebula',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 160,
    accountProgress: {
      signUpComplete: true,
      emailVerified: true,
      dailyChannelCreated: false,
    },
    customChannelCount: 1,
  },
  {
    id: 'user6',
    firstName: 'Robert',
    lastName: 'Kim',
    email: 'robert.kim@example.com',
    funFact: 'Avid reader and writer',
    avatar: 'constellation',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 170,
    accountProgress: {
      signUpComplete: true,
      emailVerified: true,
      dailyChannelCreated: true,
    },
    customChannelCount: 0,
  },
];

// Helper function to get user by ID
export function getUserById(userId: string): User | undefined {
  const result = mockUsers.find((user) => user.id === userId);
  
  return result;
}