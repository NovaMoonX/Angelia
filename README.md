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
- **Protected Routes**: Component wrapper for authenticated routes (currently pass-through, ready for future auth implementation)

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

### 📰 Primary Feed (Tidings)

A chronological feed for family updates called "Tidings":

- **Dynamic Post Cards**: Each tiding features:
  - Author avatar with preset cartoon-like icons
  - Channel badge with color coding
  - Rich text content
  - Media area supporting single images or image carousels for multiple photos
  - Relative timestamps (e.g., "30m ago", "2h ago")
  - Clickable cards that navigate to detailed post view
- **Filtering**: Select dropdown to filter tidings by channel (All Channels or specific subscriptions)
- **Sorting**: Choose between "Newest First" or "Oldest First" ordering
- **Infinite Scroll**: Automatically loads more tidings as you scroll down
- **Loading States**: Skeleton cards provide visual feedback while loading
- **Empty States**: Helpful messages when no tidings match filters

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

### 🔗 Channel Invite Flow

An intuitive system for inviting others to join your channels:

- **For Channel Owners (Inviter)**:
  - **Copy Invite Link Button**: Available in the Channel Detail Modal for owned channels
  - **Clipboard Integration**: One-click copy of shareable invite URL
  - **Success Feedback**: Toast notification confirms "Link copied to clipboard"
  - **Unique Invite Codes**: Each channel has a unique, shareable invite code
  - **Owner-Only Feature**: Invite section only visible to channel owners

- **For Invitees (Recipients)**:
  - **Dedicated Invite Page** (`/invite/:inviteCode`): Beautiful landing page for invite acceptance
  - **Personalized Invitation**: Shows inviter's name, avatar, and channel name
  - **Smart State Handling**:
    - **New Subscriber**: "Join Channel" button to accept invitation
    - **Already Subscribed**: "Go to Channel" button with notification
    - **Invalid/Expired**: Clear error message with option to return to feed
  - **Action Buttons**:
    - **Join Channel**: Subscribes user and redirects to feed with success toast
    - **Decline**: Returns to feed without joining
  - **Authentication Support**: Ready for future integration to handle logged-in and non-logged-in states

- **User Experience**:
  - Loading state while fetching invitation details
  - Consumer-friendly messaging throughout
  - Seamless integration with existing channel subscription system
  - Toast notifications for all key actions

### 🔔 Notifications & Invite Management

A streamlined notification system for managing channel invitations:

- **Bell Icon with Badge**: Located in the Feed header next to the user avatar
  - Shows a red notification dot when there are pending invites
  - Clicking navigates to the Notifications tab on the Account page
  - Accessible design with proper ARIA labels
  
- **Notifications Tab**: Dedicated section in the Account page for invite management
  - **Tab Badge**: Displays count of pending invites (e.g., "Notifications (2)")
  - **Pending Invites Section**:
    - Shows active channel invitations awaiting response
    - Each invite card displays:
      - Inviter's name
      - Channel name badge
      - Time since invitation (e.g., "12h ago", "1d ago")
      - Accept/Decline action buttons
    - **Accept Action**: 
      - Subscribes user to the channel
      - Updates invite status to "accepted"
      - Removes from pending list
      - User gains access to channel content
    - **Decline Action**:
      - Updates invite status to "declined"
      - Moves invite to Declined section
      - No channel subscription created
  
  - **Declined Invites Section**:
    - Shows previously declined invitations
    - Read-only view with inviter, channel, and decline timestamp
    - Reduced opacity to indicate inactive status
    - No action buttons available
  
  - **Empty State**: Friendly message when no invites exist
    - "No notifications yet. When someone invites you to a channel, you'll see it here."
  
- **Data Model**: `UserInvite` interface tracks:
  - Channel ID and inviter user ID
  - Invitation timestamp
  - Status (pending/accepted/declined)
  - Response timestamp for accepted/declined invites
  
- **Consumer-Friendly Design**:
  - Human-readable timestamps
  - Clear action buttons with primary/secondary styling
  - Organized separation between pending and declined invites
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
