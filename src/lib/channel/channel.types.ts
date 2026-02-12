// Channel interface
export interface Channel {
  id: string;
  name: string;
  color: string;
  isDaily: boolean | null;
  ownerId: string; // User who owns/created the channel
  subscribers: string[]; // Array of user IDs who have access to this channel
  inviteCode: string | null; // Unique invite code for sharing
}

// Channel Invite interface
export interface ChannelInvite {
  id: string;
  channelId: string;
  inviteCode: string;
  createdAt: number; // Unix timestamp in ms
  expiresAt: number | null; // Unix timestamp in ms, null for no expiration
}

// User Invite interface - for tracking invites sent to a user
export interface UserChannelInvite {
  id: string;
  channelId: string;
  invitedBy: string; // User ID who sent the invite
  invitedAt: number; // Unix timestamp in ms
  status: 'pending' | 'accepted' | 'declined';
  respondedAt: number | null; // Unix timestamp in ms when accepted/declined
}