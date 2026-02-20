// Channel interface
export interface Channel {
  id: string;
  name: string;
  description: string;
  color: string;
  isDaily: boolean | null;
  ownerId: string; // User who owns/created the channel
  subscribers: string[]; // Array of user IDs who have access to this channel
  inviteCode: string | null; // Unique invite code for sharing
  createdAt: number; // Unix timestamp in ms
  // If set, indicates the unix ms timestamp when the owner requested deletion.
  // `null` means the channel is not scheduled for deletion.
  markedForDeletionAt: number | null;
}

export type NewChannel = Omit<Channel, 'id' | 'isDaily' | 'inviteCode' | 'createdAt' | 'markedForDeletionAt'>

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