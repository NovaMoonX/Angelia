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

// Join request - a user asks to subscribe to a channel via invite URL
export interface ChannelJoinRequest {
  id: string;
  channelId: string;
  channelOwnerId: string; // Stored for efficient querying by channel owner
  requesterId: string; // User ID of the person requesting to join
  message: string; // How should the owner know it's really you?
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number; // Unix timestamp in ms
  respondedAt: number | null; // Unix timestamp in ms when accepted/declined
}