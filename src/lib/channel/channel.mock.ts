import { mockPosts } from '../post/post.mock';
import { CHANNEL_FALLBACK_DESCRIPTION } from './channel.constants';
import { Channel, ChannelJoinRequest } from './channel.types';


// Mock channel descriptions (in real app, this would come from database)
const channelDescriptions: Record<string, string> = {
  'user1-daily': 'Daily updates and life moments',
  channel2: 'Sharing delicious recipes and cooking adventures',
  channel3: 'Celebrating big achievements and special moments',
  channel4: 'Updates from the garden and growing tips',
  'user4-daily': 'Daily thoughts and experiences',
  channel1: 'Family trips, vacations, and adventures together',
  'user6-daily': 'Daily reflections and musings',
  'user3-daily': 'Day-to-day life and casual updates',
  'currentUser-daily': 'My daily updates and life moments',
};

export const mockChannels: Channel[] = [
  ...Array.from(
    new Map(
      mockPosts.map((post) => [
        post.channelId,
        {
          id: post.channelId,
          name: post.channelName,
          color: post.channelColor,
          description: channelDescriptions[post.channelId] || CHANNEL_FALLBACK_DESCRIPTION,
          isDaily: post.isDaily ?? null,
          ownerId: post.authorId,
          // Mock subscribers - in real app this would come from database
          subscribers: [
            'currentUser', // Current user has access to all channels for demo
            post.authorId,
            ...(['user1', 'user2', 'user3', 'user4', 'user5', 'user6'].filter(
              (id) => id !== post.authorId,
            )),
          ],
          // Generate a unique invite code for each channel
          // Use fixed code for testing: channel2 = "TESTCODE" (Cooking Corner by Michael Chen)
          inviteCode: post.channelId === 'channel2' ? 'TESTCODE' : Math.random().toString(36).substring(2, 10).toUpperCase(),
          createdAt: Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30), // Random creation time within last 30 days
          markedForDeletionAt: null,
        },
      ]),
    ).values(),
  ),
  // Add a test channel for invite testing where currentUser is NOT subscribed
  {
    id: 'test-invite-channel',
    name: 'Photography Club',
    color: '#8b5cf6', // Purple
    isDaily: false,
    ownerId: 'user1',
    subscribers: ['user1', 'user2', 'user3'], // currentUser is NOT in this list
    inviteCode: 'INVITE2024',
    description: 'Photography enthusiasts sharing tips and experiences',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10, // Created 10 days ago
    markedForDeletionAt: null,
  },
  // Add a demo channel with fixed invite code for testing
  {
    id: 'demo-channel',
    name: 'Family Updates',
    color: '#f59e0b', // Amber
    isDaily: false,
    ownerId: 'user2',
    subscribers: ['user2', 'user3', 'user4'], // currentUser is NOT in this list
    inviteCode: '6BP6VZWX',
    description: 'Updates and news from the family',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // Created 7 days ago
    markedForDeletionAt: null,
  },
];

// Helper function to generate invite code
export function generateInviteCode(): string {
  const result = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  return result;
}

// Helper function to get channel by invite code
export function getChannelByInviteCode(inviteCode: string): Channel | undefined {
  const result = mockChannels.find((channel) => channel.inviteCode === inviteCode);
  
  return result;
}

// Mock join requests - requests sent to join channels via invite URL
export const mockJoinRequests: ChannelJoinRequest[] = [
  // Pending request to Photography Club from currentUser (outgoing)
  {
    id: 'join-req-1',
    channelId: 'test-invite-channel',
    channelOwnerId: 'user1',
    requesterId: 'currentUser',
    message: "It's me, Alex! We met at the hiking trip last summer 🏔️",
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 12,
    respondedAt: null,
  },
  // Pending incoming request to Cooking Corner - currentUser is owner
  {
    id: 'join-req-2',
    channelId: 'channel2',
    channelOwnerId: 'currentUser',
    requesterId: 'user3',
    message: "Hey, it's Emma! You know me from book club 📚",
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    respondedAt: null,
  },
  // Another pending incoming request
  {
    id: 'join-req-3',
    channelId: 'channel2',
    channelOwnerId: 'currentUser',
    requesterId: 'user5',
    message: "It's James, your neighbor! You invited me last weekend 🤝",
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 30,
    respondedAt: null,
  },
  // Accepted incoming request (currentUser already responded)
  {
    id: 'join-req-4',
    channelId: 'channel2',
    channelOwnerId: 'currentUser',
    requesterId: 'user4',
    message: "Hi! It's Laura from yoga class 🧘",
    status: 'accepted',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    respondedAt: Date.now() - 1000 * 60 * 60 * 24,
  },
  // Declined incoming request
  {
    id: 'join-req-5',
    channelId: 'channel2',
    channelOwnerId: 'currentUser',
    requesterId: 'user6',
    message: "Hey it's me from the internet 👋",
    status: 'declined',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    respondedAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
  },
];