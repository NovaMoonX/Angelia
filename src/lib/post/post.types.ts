import { AvatarPreset } from '../app';

// Reaction interface
export interface Reaction {
  emoji: string; // Single character emoji
  userIds: string[]; // Array of user IDs who reacted with this emoji
}

// Comment/Message interface
export interface Comment {
  id: string;
  authorId: string;
  text: string;
  timestamp: number; // Unix timestamp in ms
}

// Media item interface
export interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: AvatarPreset;
  channelId: string;
  channelName: string;
  channelColor: string;
  text: string;
  media: MediaItem[] | null; // Optional media array supporting both images and videos
  timestamp: number; // Unix timestamp in ms
  isHighPriority: boolean;
  isDaily: boolean | null; // Indicates if this is from a daily channel
  reactions: Reaction[]; // Array of reactions
  comments: Comment[]; // Array of comments/messages
  conversationEnrollees: string[]; // User IDs who have joined the conversation
}