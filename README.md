# Angelia

Angelia is an intentional family connection app designed to solve "conversational overload." It moves away from the noise of group chats and toward organized, private family communication.

## Features

### 🔐 Authentication Flow (Mock)

Mock authentication interface for the gateway experience:

- **Login Page** (`/login`): Sleek, single-page authentication
  - **Sign In Mode**: Simple email and password login
  - **Create Account Mode**: Comprehensive signup with essential user information
    - First Name and Last Name (required)
    - Email (required)
    - Phone Number (optional) - for future SMS notifications
    - Password (required)
  - Seamless toggle between modes
  - Query parameter support (`?mode=signup`) for direct navigation to signup
  - "Get Started" button on homepage directs to Create Account mode
  - All fields built with FormFactories from Dreamer UI
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

### 📖 About Page - The Manifesto

A text-focused page explaining the research and philosophy behind Angelia:

- **Consumer-Friendly Content**: Warm, human language that avoids jargon and speaks directly to real people
- **The Connectivity Paradox**: Explores how more communication channels lead to less meaningful connection
- **Three Core Sections**:
  - **The Crisis of Synchronous Noise** - Why group chats and social media fail to deliver meaningful family connection
  - **The Solution: Angelia** - How channel-based organization and subscription agency solve conversational overload
  - **The 180-Day Rule** - Why updates fade after six months to mirror human memory and reduce performance pressure
- **Comparison Table**: Visual comparison of Privacy, Intentionality, and Ephemerality between traditional social media and Angelia

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
