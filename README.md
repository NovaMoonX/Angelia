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
- **Filtering**: Select dropdown to filter tidings by channel (All Channels or specific subscriptions)
- **Sorting**: Choose between "Newest First" or "Oldest First" ordering
- **Infinite Scroll**: Automatically loads more tidings as you scroll down
- **Loading States**: Skeleton cards provide visual feedback while loading
- **Empty States**: Helpful messages when no tidings match filters

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
