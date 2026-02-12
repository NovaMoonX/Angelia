import { mockPosts } from '../post/post.mock';
import { Channel, ChannelInvite, UserChannelInvite } from './channel.types';

export const mockChannels: Channel[] = [
  ...Array.from(
    new Map(
      mockPosts.map((post) => [
        post.channelId,
        {
          id: post.channelId,
          name: post.channelName,
          color: post.channelColor,
          isDaily: post.isDaily,
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

// Mock channel invites
export const mockInvites: ChannelInvite[] = [];

// Helper function to create invite for a channel
export function createChannelInvite(channelId: string): ChannelInvite {
  const channel = mockChannels.find((ch) => ch.id === channelId);
  if (!channel) {
    throw new Error('Channel not found');
  }

  const inviteCode = channel.inviteCode || generateInviteCode();
  
  // Update channel with invite code if it doesn't have one
  if (!channel.inviteCode) {
    channel.inviteCode = inviteCode;
  }

  const invite: ChannelInvite = {
    id: `invite-${Date.now()}`,
    channelId,
    inviteCode,
    createdAt: Date.now(),
    expiresAt: null, // No expiration for now
  };

  const result = invite;
  
  return result;
}

// Mock user invites - invites sent to the current user
export const mockUserChannelInvites: UserChannelInvite[] = [
  // Pending invite to Photography Club from Sarah
  {
    id: 'user-invite-1',
    channelId: 'test-invite-channel', // Photography Club
    invitedBy: 'user1', // Sarah Johnson
    invitedAt: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
    status: 'pending',
    respondedAt: null,
  },
  // Pending invite to Family Updates from Michael
  {
    id: 'user-invite-2',
    channelId: 'demo-channel', // Family Updates
    invitedBy: 'user2', // Michael Chen
    invitedAt: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    status: 'pending',
    respondedAt: null,
  },
  // Declined invite to Garden Updates from Sarah (older)
  {
    id: 'user-invite-3',
    channelId: 'channel4', // Garden Updates
    invitedBy: 'user1', // Sarah Johnson
    invitedAt: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    status: 'declined',
    respondedAt: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
  },
];