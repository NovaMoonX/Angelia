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

export type PostStatus = 'uploading' | 'ready' | 'error';

export interface Post {
  id: string;
  authorId: string;
  channelId: string;
  text: string;
  media: MediaItem[] | null; // Optional media array supporting both images and videos
  timestamp: number; // Unix timestamp in ms
  reactions: Reaction[]; // Array of reactions
  comments: Comment[]; // Array of comments/messages
  conversationEnrollees: string[]; // User IDs who have joined the conversation
  markedForDeletionAt: number | null; // Timestamp for when the post is marked for deletion (for demo purposes)
  status: PostStatus;
}
