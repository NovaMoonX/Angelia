// Mock data for Tidings (posts)

// Avatar presets type
export type AvatarPreset = 'astronaut' | 'moon' | 'star' | 'galaxy' | 'nebula' | 'planet' | 'cosmic-cat' | 'dream-cloud' | 'rocket' | 'constellation' | 'comet' | 'twilight';

// Channel interface
export interface Channel {
  id: string;
  name: string;
  color: string;
  isDaily?: boolean;
  ownerId: string; // User who owns/created the channel
  subscribers: string[]; // Array of user IDs who have access to this channel
  inviteCode?: string; // Unique invite code for sharing
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
export interface UserInvite {
  id: string;
  channelId: string;
  invitedBy: string; // User ID who sent the invite
  invitedAt: number; // Unix timestamp in ms
  status: 'pending' | 'accepted' | 'declined';
  respondedAt: number | null; // Unix timestamp in ms when accepted/declined
}

// User interface
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified: boolean;
  funFact: string;
  avatar: AvatarPreset;
  joinedAt: number; // Unix timestamp in ms
}

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

export interface Tiding {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: AvatarPreset;
  channelId: string;
  channelName: string;
  channelColor: string;
  text: string;
  images: string[];
  media?: MediaItem[]; // Optional media array supporting both images and videos
  timestamp: number; // Unix timestamp in ms
  isHighPriority: boolean;
  isDaily?: boolean; // Indicates if this is from a daily channel
  reactions: Reaction[]; // Array of reactions
  comments: Comment[]; // Array of comments/messages
  conversationEnrollees: string[]; // User IDs who have joined the conversation
}

// Mock tidings data
export const mockTidings: Tiding[] = [
  {
    id: '1',
    authorId: 'user1',
    authorName: 'Sarah Johnson',
    authorAvatar: 'cosmic-cat',
    channelId: 'user1-daily',
    channelName: 'Daily',
    channelColor: 'INDIGO',
    text: 'Just got back from an amazing hike at Red Rock Canyon! The kids were troopers and made it all the way to the top. The view was absolutely breathtaking.',
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop'],
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    isHighPriority: false,
    isDaily: true,
    reactions: [
      { emoji: '😍', userIds: ['user2', 'user3'] },
      { emoji: '🏔️', userIds: ['user4'] },
    ],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '1a',
    authorId: 'user2',
    authorName: 'Alex Morgan',
    authorAvatar: 'galaxy',
    channelId: 'user2-daily',
    channelName: 'Daily',
    channelColor: 'INDIGO',
    text: 'Beautiful morning walk today! Found a new coffee shop around the corner - definitely going back.',
    images: [],
    timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
    isHighPriority: false,
    isDaily: true,
    reactions: [],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '1a1',
    authorId: 'user3',
    authorName: 'Emily Rodriguez',
    authorAvatar: 'star',
    channelId: 'channel6',
    channelName: 'Travel Vlogs',
    channelColor: 'CYAN',
    text: 'Check out this amazing sunset from my trip! 🌅',
    images: [],
    media: [
      { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    ],
    timestamp: Date.now() - 1000 * 60 * 47, // 47 minutes ago
    isHighPriority: false,
    reactions: [
      { emoji: '😍', userIds: ['user1', 'user2'] },
    ],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '1a2',
    authorId: 'user4',
    authorName: 'David Park',
    authorAvatar: 'planet',
    channelId: 'channel7',
    channelName: 'Tech Reviews',
    channelColor: 'ORANGE',
    text: 'Comparing the latest gadgets - which one should I get? 🤔',
    images: [],
    media: [
      { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    ],
    timestamp: Date.now() - 1000 * 60 * 48, // 48 minutes ago
    isHighPriority: false,
    reactions: [],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '1b',
    authorId: 'user1',
    authorName: 'Sarah Johnson',
    authorAvatar: 'cosmic-cat',
    channelId: 'channel5',
    channelName: 'Family Moments',
    channelColor: 'VIOLET',
    text: 'The kids putting on their little talent show! So proud of them. 🎭',
    images: [],
    media: [
      { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      { type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop' },
    ],
    timestamp: Date.now() - 1000 * 60 * 50, // 50 minutes ago
    isHighPriority: false,
    reactions: [
      { emoji: '😍', userIds: ['user2', 'user3'] },
      { emoji: '👏', userIds: ['user4', 'user5'] },
    ],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'Michael Chen',
    authorAvatar: 'rocket',
    channelId: 'channel2',
    channelName: 'Cooking Corner',
    channelColor: 'EMERALD',
    text: 'Tried a new recipe tonight - homemade pasta carbonara! Turned out better than expected. Recipe in the comments if anyone wants it.',
    images: [
      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    isHighPriority: false,
    reactions: [
      { emoji: '🤤', userIds: ['currentUser', 'user1', 'user5'] },
      { emoji: '👨‍🍳', userIds: ['user3'] },
    ],
    comments: [
      {
        id: 'c1',
        authorId: 'currentUser',
        text: 'This looks amazing! Would love the recipe!',
        timestamp: Date.now() - 1000 * 60 * 60 * 1.5, // 1.5 hours ago
      },
    ],
    conversationEnrollees: ['currentUser'],
  },
  {
    id: '3',
    authorId: 'user3',
    authorName: 'Emily Rodriguez',
    authorAvatar: 'star',
    channelId: 'channel3',
    channelName: 'Milestone Moments',
    channelColor: 'PINK',
    text: 'BIG NEWS! 🎉 Just got accepted into my dream graduate school! All those late nights studying paid off. So grateful for all your support.',
    images: [],
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    isHighPriority: true,
    reactions: [
      { emoji: '🎉', userIds: ['user1', 'user2', 'user4', 'user5', 'user6'] },
      { emoji: '👏', userIds: ['currentUser'] },
      { emoji: '🎓', userIds: ['user1', 'user4'] },
    ],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '4',
    authorId: 'user1',
    authorName: 'Sarah Johnson',
    authorAvatar: 'cosmic-cat',
    channelId: 'channel4',
    channelName: 'Garden Updates',
    channelColor: 'LIME',
    text: 'The tomato plants are finally producing! First harvest of the season. Nothing beats the taste of homegrown tomatoes.',
    images: [
      'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594097677688-9c0d3229404a?w=800&h=600&fit=crop',
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    isHighPriority: false,
    reactions: [],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '5',
    authorId: 'user4',
    authorName: 'David Park',
    authorAvatar: 'planet',
    channelId: 'user4-daily',
    channelName: 'Daily',
    channelColor: 'INDIGO',
    text: 'Finally finished building the treehouse! Took three weekends but it was worth it. The kids are over the moon.',
    images: ['https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=800&h=600&fit=crop'],
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    isHighPriority: false,
    isDaily: true,
    reactions: [],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '6',
    authorId: 'user5',
    authorName: 'Lisa Thompson',
    authorAvatar: 'nebula',
    channelId: 'channel1',
    channelName: 'Family Adventures',
    channelColor: 'AMBER',
    text: 'Beach day with the family! Perfect weather, clear water, and the kids found so many seashells. Making memories.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    isHighPriority: false,
    reactions: [],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '7',
    authorId: 'user6',
    authorName: 'Robert Kim',
    authorAvatar: 'constellation',
    channelId: 'user6-daily',
    channelName: 'Daily',
    channelColor: 'INDIGO',
    text: 'Just finished "The Midnight Library" - what a thought-provoking read! Highly recommend. Anyone else read it?',
    images: [],
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
    isHighPriority: false,
    isDaily: true,
    reactions: [],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '8',
    authorId: 'user2',
    authorName: 'Michael Chen',
    authorAvatar: 'rocket',
    channelId: 'channel3',
    channelName: 'Milestone Moments',
    channelColor: 'PINK',
    text: "Our little one took her first steps today! 🚶‍♀️ Can't believe how fast she's growing. Managed to catch it on video!",
    images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop'],
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    isHighPriority: true,
    reactions: [],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '9',
    authorId: 'user3',
    authorName: 'Emily Rodriguez',
    authorAvatar: 'star',
    channelId: 'user3-daily',
    channelName: 'Daily',
    channelColor: 'INDIGO',
    text: 'Morning coffee tastes better when you know you have a great day ahead! ☕ Working on my thesis today.',
    images: [],
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
    isHighPriority: false,
    isDaily: true,
    reactions: [],
    comments: [],
    conversationEnrollees: [],
  },
  {
    id: '10',
    authorId: 'currentUser',
    authorName: 'Alex Morgan',
    authorAvatar: 'galaxy',
    channelId: 'currentUser-daily',
    channelName: 'Daily',
    channelColor: 'INDIGO',
    text: 'Beautiful morning walk today! Found a new coffee shop around the corner - definitely going back.',
    images: [],
    timestamp: Date.now() - 1000 * 60 * 45, // 45 minutes ago
    isHighPriority: false,
    isDaily: true,
    reactions: [],
    comments: [],
    conversationEnrollees: [],
  },
];

// Get unique channels from mock data with owner and subscribers
export const mockChannels: Channel[] = [
  ...Array.from(
    new Map(
      mockTidings.map((tiding) => [
        tiding.channelId,
        {
          id: tiding.channelId,
          name: tiding.channelName,
          color: tiding.channelColor,
          isDaily: tiding.isDaily,
          ownerId: tiding.authorId,
          // Mock subscribers - in real app this would come from database
          subscribers: [
            'currentUser', // Current user has access to all channels for demo
            tiding.authorId,
            ...(['user1', 'user2', 'user3', 'user4', 'user5', 'user6'].filter(
              (id) => id !== tiding.authorId,
            )),
          ],
          // Generate a unique invite code for each channel
          // Use fixed code for testing: channel2 = "TESTCODE" (Cooking Corner by Michael Chen)
          inviteCode: tiding.channelId === 'channel2' ? 'TESTCODE' : Math.random().toString(36).substring(2, 10).toUpperCase(),
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

// Mock current user data
export const mockCurrentUser: User = {
  id: 'currentUser',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex.morgan@example.com',
  emailVerified: true,
  funFact: 'Coffee enthusiast ☕ | Book lover 📚 | Weekend hiker 🥾 | Always up for trying new recipes',
  avatar: 'galaxy',
  joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 180, // 180 days ago (~6 months)
};

// Mock users database
export const mockUsers: User[] = [
  mockCurrentUser,
  {
    id: 'user1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    emailVerified: true,
    funFact: 'Love hiking and photography',
    avatar: 'cosmic-cat',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 200,
  },
  {
    id: 'user2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@example.com',
    emailVerified: true,
    funFact: 'Amateur chef and food lover',
    avatar: 'rocket',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 150,
  },
  {
    id: 'user3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@example.com',
    emailVerified: true,
    funFact: 'Graduate student and bookworm',
    avatar: 'star',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 120,
  },
  {
    id: 'user4',
    firstName: 'David',
    lastName: 'Park',
    email: 'david.park@example.com',
    emailVerified: true,
    funFact: 'DIY enthusiast and builder',
    avatar: 'planet',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 190,
  },
  {
    id: 'user5',
    firstName: 'Lisa',
    lastName: 'Thompson',
    email: 'lisa.thompson@example.com',
    emailVerified: true,
    funFact: 'Beach lover and travel enthusiast',
    avatar: 'nebula',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 160,
  },
  {
    id: 'user6',
    firstName: 'Robert',
    lastName: 'Kim',
    email: 'robert.kim@example.com',
    emailVerified: true,
    funFact: 'Avid reader and writer',
    avatar: 'constellation',
    joinedAt: Date.now() - 1000 * 60 * 60 * 24 * 170,
  },
];

// Helper function to get user by ID
export function getUserById(userId: string): User | undefined {
  const result = mockUsers.find((user) => user.id === userId);
  
  return result;
}

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
export const mockUserInvites: UserInvite[] = [
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
