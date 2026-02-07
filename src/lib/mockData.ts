// Mock data for Tidings (posts)

export interface Tiding {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: 'astronaut' | 'moon' | 'star' | 'galaxy' | 'nebula' | 'planet' | 'cosmic-cat' | 'dream-cloud' | 'rocket' | 'constellation' | 'comet' | 'twilight';
  channelId: string;
  channelName: string;
  channelColor: string;
  text: string;
  images: string[];
  timestamp: number; // Unix timestamp in ms
  isHighPriority: boolean;
  isDaily?: boolean; // Indicates if this is from a daily channel
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
    channelColor: '#6366f1', // indigo-500
    text: 'Just got back from an amazing hike at Red Rock Canyon! The kids were troopers and made it all the way to the top. The view was absolutely breathtaking.',
    images: ['https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=600&fit=crop'],
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutes ago
    isHighPriority: false,
    isDaily: true,
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'Michael Chen',
    authorAvatar: 'rocket',
    channelId: 'channel2',
    channelName: 'Cooking Corner',
    channelColor: '#10b981', // emerald-500
    text: 'Tried a new recipe tonight - homemade pasta carbonara! Turned out better than expected. Recipe in the comments if anyone wants it.',
    images: [
      'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop',
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
    isHighPriority: false,
  },
  {
    id: '3',
    authorId: 'user3',
    authorName: 'Emily Rodriguez',
    authorAvatar: 'star',
    channelId: 'channel3',
    channelName: 'Milestone Moments',
    channelColor: '#ec4899', // pink-500
    text: 'BIG NEWS! 🎉 Just got accepted into my dream graduate school! All those late nights studying paid off. So grateful for all your support.',
    images: [],
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    isHighPriority: true,
  },
  {
    id: '4',
    authorId: 'user1',
    authorName: 'Sarah Johnson',
    authorAvatar: 'cosmic-cat',
    channelId: 'channel4',
    channelName: 'Garden Updates',
    channelColor: '#84cc16', // lime-500
    text: 'The tomato plants are finally producing! First harvest of the season. Nothing beats the taste of homegrown tomatoes.',
    images: [
      'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594097677688-9c0d3229404a?w=800&h=600&fit=crop',
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    isHighPriority: false,
  },
  {
    id: '5',
    authorId: 'user4',
    authorName: 'David Park',
    authorAvatar: 'planet',
    channelId: 'user4-daily',
    channelName: 'Daily',
    channelColor: '#6366f1', // indigo-500
    text: 'Finally finished building the treehouse! Took three weekends but it was worth it. The kids are over the moon.',
    images: ['https://images.unsplash.com/photo-1587502537745-84b86da1204f?w=800&h=600&fit=crop'],
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    isHighPriority: false,
    isDaily: true,
  },
  {
    id: '6',
    authorId: 'user5',
    authorName: 'Lisa Thompson',
    authorAvatar: 'nebula',
    channelId: 'channel1',
    channelName: 'Family Adventures',
    channelColor: '#f59e0b', // amber-500
    text: 'Beach day with the family! Perfect weather, clear water, and the kids found so many seashells. Making memories.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    ],
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    isHighPriority: false,
  },
  {
    id: '7',
    authorId: 'user6',
    authorName: 'Robert Kim',
    authorAvatar: 'constellation',
    channelId: 'user6-daily',
    channelName: 'Daily',
    channelColor: '#6366f1', // indigo-500
    text: 'Just finished "The Midnight Library" - what a thought-provoking read! Highly recommend. Anyone else read it?',
    images: [],
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
    isHighPriority: false,
    isDaily: true,
  },
  {
    id: '8',
    authorId: 'user2',
    authorName: 'Michael Chen',
    authorAvatar: 'rocket',
    channelId: 'channel3',
    channelName: 'Milestone Moments',
    channelColor: '#ec4899', // pink-500
    text: "Our little one took her first steps today! 🚶‍♀️ Can't believe how fast she's growing. Managed to catch it on video!",
    images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop'],
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    isHighPriority: true,
  },
  {
    id: '9',
    authorId: 'user3',
    authorName: 'Emily Rodriguez',
    authorAvatar: 'star',
    channelId: 'user3-daily',
    channelName: 'Daily',
    channelColor: '#6366f1', // indigo-500
    text: 'Morning coffee tastes better when you know you have a great day ahead! ☕ Working on my thesis today.',
    images: [],
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
    isHighPriority: false,
    isDaily: true,
  },
];

// Get unique channels from mock data
export const mockChannels = Array.from(
  new Map(
    mockTidings.map((tiding) => [
      tiding.channelId,
      { id: tiding.channelId, name: tiding.channelName, color: tiding.channelColor, isDaily: tiding.isDaily },
    ]),
  ).values(),
);
