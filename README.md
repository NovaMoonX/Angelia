# Angelia

Angelia is an intentional family connection app designed to solve "conversational overload." It moves away from the noise of group chats and toward organized, private family communication.

## Features

### 🔐 Authentication Flow (Mock)

Multi-step authentication experience using Dreamer UI components:

- **Auth Page** (`/auth`): Modern authentication with query parameter routing
  - **Login Mode** (`?mode=login`): Email and password authentication using AuthForm component
  - **Signup Mode** (`?mode=signup`): Two-step registration process
    - **Step 1**: Email and password with confirmation (AuthForm component)
    - **Step 2**: Profile completion with:
      - First Name and Last Name (required)
      - Avatar selection from 12 preset options (astronaut, moon, star, galaxy, nebula, planet, cosmic-cat, dream-cloud, rocket, constellation, comet, twilight)
      - Fun fact about yourself (required)
  - Seamless toggle between login/signup modes with automatic URL updates
  - "Get Started" button on homepage directs to signup mode
  - Clean, centered layout with brand logo
- **Email Verification** (`/verify-email`): Post-signup verification flow
  - Confirmation message with user's email
  - "Resend Link" button with success feedback
  - "Back to Login" navigation
- **Protected Routes**: Intelligent route protection with demo mode support
  - When **demo mode is DISABLED**:
    - Requires user authentication for protected routes (`/feed`, `/post/:id`, `/account`, `/invite/:channelId/:inviteCode`)
    - Unauthenticated users are redirected to `/auth` with redirect parameter to return after login
    - Authenticated users must have verified their email to access protected routes
    - Unverified users are redirected to `/verify-email` page
  - When **demo mode is ENABLED**:
    - All routes are accessible without authentication (pass-through)
    - Allows users to explore the app with sample data
  - **Public Routes** (always accessible):
    - Home page (`/`)
    - About page (`/about`)
    - Auth page (`/auth`)
    - Verify Email page (`/verify-email`)

### 🔥 Landing Page

A minimalist, high-impact landing page that introduces Angelia's core value proposition:

- **Brand Identity**: Warm logo featuring a house with heart, representing family connection
- **Hero Section**: "Family Connection, Without the Noise." with prominent "Get Started" call-to-action
- **Categorical Agency**: Highlights the bilateral agency model where sharers categorize updates and readers subscribe to what matters, with visual illustration
- **Target Use Cases**: 
  - 🏡 **Long-Distance Families** - Anchor yourself in the family narrative
  - 💼 **Busy Professionals** - Catch up on themed updates during downtime
  - 👨‍👩‍👧‍👦 **The Saturated Parent** - Share unfiltered updates without performance pressure
- 
### 📖 About Page - The Manifesto

A text-focused page explaining the research and philosophy behind Angelia:

- **Consumer-Friendly Content**: Warm, human language that avoids jargon and speaks directly to real people
- **The Connectivity Paradox**: Explores how more communication channels lead to less meaningful connection
- **Three Core Sections**:
  - **The Crisis of Synchronous Noise** - Why group chats and social media fail to deliver meaningful family connection
  - **The Solution: Angelia** - How channel-based organization and subscription agency solve conversational overload
  - **The 180-Day Rule** - Why updates fade after six months to mirror human memory and reduce performance pressure
- **Comparison Table**: Visual comparison of Privacy, Intentionality, and Ephemerality between traditional social media and Angelia

### 📰 Primary Feed (Posts)

A chronological feed for family updates called "Posts":

- **Create New Post**: 
  - Prominent "+ New Post" button in the feed header
  - Navigates to a dedicated post creation page (`/post/new`)
  - Enter text content (required)
  - Select which of your channels to post to
  - Attach up to 5 media files (images or videos)
  - File size validation (max 10MB per file)
  - Supported formats: JPEG, PNG, GIF, WebP for images; MP4, WebM, OGG for videos
  - Option to mark posts as high priority
  - Clean, intuitive form interface with real-time validation
- **Dynamic Post Cards**: Each post features:
  - Author avatar with preset cartoon-like icons
  - Channel badge with color coding
  - Rich text content
  - Media area supporting single images or image carousels for multiple photos
  - Relative timestamps (e.g., "30m ago", "2h ago")
  - Clickable cards that navigate to detailed post view
- **Filtering**: Select dropdown to filter posts by channel (All Channels or specific subscriptions)
- **Sorting**: Choose between "Newest First" or "Oldest First" ordering
- **Infinite Scroll**: Automatically loads more posts as you scroll down
- **Scroll Position Restoration**: When viewing a post and returning to the feed, your previous scroll position is restored, maintaining your place in the feed and preserving the infinite scroll state
- **Scroll-to-Top Button**: A floating button appears in the bottom right corner when you've scrolled past the first two posts, allowing quick navigation back to the top of the feed
- **Loading States**: Skeleton cards provide visual feedback while loading
- **Empty States**: Helpful messages when no posts match filters

### 💬 Reactions & Conversations

An innovative engagement system that encourages thoughtful interaction through progressive disclosure:

- **Progressive Disclosure Flow**: 
  - Users must react to a post before seeing others' reactions
  - After reacting, users can see all reactions and add more
  - Users must explicitly join a conversation to participate
  - This design promotes authentic engagement without social pressure

- **Reactions Tab** (Slack-style):
  - Emoji reactions with user counts (e.g., "😍 2", "🎉 5")
  - Reactions sorted by count (most popular first)
  - Current user's reactions highlighted with a ring
  - Click any reaction to add/remove your reaction
  - 8 common emoji choices: ❤️ 👍 😊 🎉 😮 😢 😄 🔥

- **Conversation Tab**:
  - Opt-in conversation enrollment - users choose to participate
  - Clean message interface with:
    - User avatar (small, to the left)
    - User name and timestamp
    - Message text with proper word wrapping
  - Real-time message sending with textarea and send button
  - Empty state prompt: "No messages yet. Start the conversation!"
  - Tab badges show count (e.g., "Conversation (3)")

- **Reusable Components**:
  - `ChatMessage` component can be used elsewhere in the app
  - `ReactionDisplay` component for consistent reaction UI
  - Both designed with consumer-friendly, warm language

### 🛠️ Channel Management (The Channel Foundry)

A comprehensive interface for creating and managing channels to organize your updates:

- **My Channels Tab**: Manage your created channels
  - **Daily Channel**: Every user has a built-in daily channel for everyday updates (cannot be deleted)
  - **Custom Channels**: Create up to 3 additional channels with:
    - Custom name and description
    - Color-coded badges from 12 pre-defined colors
    - Edit and delete capabilities
  - **Channel Cards**: Clean UI showing channel name, description preview, and action buttons
  - **3-Channel Limit**: Enforces intentionality by limiting custom channels (excluding daily channel)
  - **Visual Separation**: Separator between daily and custom channels with clear labels
  - **Channel Counter**: "X / 3 channels" indicator showing your usage
- **Subscribed Channels Tab**: View all channels you follow from other users
  - Browse channel cards with descriptions
  - Click to view full channel details and subscribers
  - **Unsubscribe**: Leave any subscribed channel with a confirmation dialog; the channel will no longer appear in your feed
- **Create/Edit Modal**: FormFactories-powered forms for channel management
  - Required channel name field
  - Optional description field
  - Visual color picker with 12 vibrant options (Indigo, Amber, Emerald, Pink, Lime, Purple, Rose, Cyan, Orange, Teal, Blue, Violet)
- **Channel Detail Modal**: View comprehensive channel information
  - Full channel description
  - Ownership indicator
  - Subscriber list with avatars and names
- **Delete Protection**: Confirmation dialog for destructive actions using ActionModal
  - Clear warning message
  - Cannot delete daily channel
  - Immediate UI update after deletion

### 🔗 Channel Invite & Join Request Flow

A privacy-first system for joining channels via URL-based invite links and owner-reviewed join requests:

- **For Channel Owners**:
  - **Copy Invite Link Button**: Available in the Channel Detail Modal for owned channels
  - **Clipboard Integration**: One-click copy of shareable invite URL (`/invite/:channelId/:inviteCode`)
  - **Unique Invite Codes**: Each channel has a unique code embedded in the URL
  - **Owner-Only Feature**: Invite section only visible to channel owners
  - **Refresh Invite Code**: Owners can generate a new invite code at any time (e.g., to stop unwanted requests); the old link immediately becomes invalid. A contextual help icon tooltip next to the button explains when and why to use this feature.

- **For People Joining (via Invite URL)**:
  - **Dedicated Invite Page** (`/invite/:channelId/:inviteCode`): Landing page that shows channel info
  - **Authentication Required**: Redirects to `/auth` if the user is not signed in
  - **Smart State Handling**:
    - **Already Subscribed**: Friendly "you're already in!" message
    - **Pending / Accepted Request**: Shows the request status so you know what's happening
    - **Declined Request**: Users with a previously declined request can send a new request (they are not permanently blocked)
    - **Invalid Link**: Clear error message with option to return to feed
  - **Identification Prompt**: "Hey, how should [channel owner] know it's really you? 👀"
    - Playful, friendly tone encouraging an identifying message
    - Up to 300 characters
  - **Submit**: Creates a join request in Firestore; owner reviews before access is granted

### 🔔 Notifications & Join Request Management

A clear notification system for tracking who wants to join your channels and the status of your own requests:

- **Bell Icon with Badge**: Located in the Feed header next to the user avatar
  - Shows a red notification dot when there are pending incoming join requests
  - Clicking navigates to the Notifications section on the Account page

- **Notifications Section** (Account page):
  - **Incoming Requests** (for channel owners):
    - Shows all pending requests from people who want to join your channels
    - Each card displays: requester avatar & name, channel badge, their identification message, and time sent
    - **Accept**: Adds the requester as a subscriber and updates the request in Firestore
    - **Decline**: Marks the request as declined in Firestore
  - **Your Requests** (requests you have sent):
    - Shows all join requests you have submitted
    - Displays the channel, your identification message, and current status
    - Status labels: "Pending review", "Accepted", "Declined"
  - **Empty State**: "Nothing here yet. Share your channel invite link and join requests will appear here."



- **Data Model**: `ChannelJoinRequest` interface tracks:
  - Channel ID and channel owner ID (for efficient querying)
  - Requester user ID
  - Identification message from the requester
  - Status (`pending` / `accepted` / `declined`)
  - Request timestamp and response timestamp

- **Consumer-Friendly Design**:
  - Playful identification prompt encourages personal, recognisable messages
  - Human-readable timestamps
  - Clear action buttons with primary/secondary styling
  - Visual hierarchy with count badges and sections

### 🎨 Design & Visual Aesthetic

- **Warm, Domestic Accent Color**: Amber tones create an intentional, calm atmosphere (not high-engagement)
- **Minimalist Layout**: Clean, spacious design using standard layout structures
- **Responsive Design**: Optimized for both desktop and mobile viewing
- **Typography**: Large, readable headings with ample whitespace for clarity

## Tech Stack

- [React](https://react.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Dreamer UI](https://www.npmjs.com/package/@moondreamsdev/dreamer-ui)
- [React Router](https://reactrouter.com/)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```
