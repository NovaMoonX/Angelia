// Fun phrases for when there are no messages yet
export const START_CONVERSATION_PHRASES = [
  "We're all friends here!",
  "Break the ice and say hi!",
  "Your voice matters here.",
  "Every great chat starts somewhere!",
  "Be the first to share!",
  "Kick things off with your thoughts!",
  "Don't be shy—we want to hear from you!",
  "Let's get this conversation rolling!",
  "Speak your heart!",
  "We're listening—share away!",
  "Make this space come alive!",
  "Every word counts!",
  "Lead the way with your message!",
  "No judgment, just connection!",
  "Say what's on your mind!",
  "Your perspective is valuable!",
  "Light up this conversation!",
  "The first word is always the hardest—you got this!",
];

// Fun phrases for when there are already messages
export const JOIN_CONVERSATION_PHRASES = [
  "Aren't you curious what they're saying?",
  "The conversation is heating up!",
  "Jump in—everyone's welcome!",
  "See what the buzz is about!",
  "Don't miss out!",
  "Your thoughts could add so much!",
  "They're waiting to hear from you!",
  "Add your voice to the mix!",
  "Join the chat—it's lively in here!",
  "Curious minds unite!",
  "There's room for you in this conversation!",
  "See what everyone's talking about!",
  "We're missing your input!",
  "The more, the merrier!",
  "Dive into the discussion!",
  "Connect with your people!",
  "Everyone has something to share—including you!",
  "Don't just watch—participate!",
  "Peek inside and join the chat!",
  "Add your voice to the mix!",
];

export const COMMON_EMOJIS = ['❤️', '👀', '😊', '🎉', '😮', '😢', '😄', '🔥'];

// Utility function to get a random phrase from an array
export function getRandomPhrase(phrases: string[]): string {
  const randomIndex = Math.floor(Math.random() * phrases.length);
  return phrases[randomIndex];
}

// Utility function to validate if a string is a single emoji
export function isValidEmoji(str: string): boolean {
  if (!str || str.length === 0) return false;
  
  // Check if it's a single character (or emoji sequence)
  // Using Array.from to handle multi-byte characters properly
  const chars = Array.from(str);
  if (chars.length > 2) return false; // Only allow 1 character
  
  // Emoji regex pattern - matches most common emoji ranges
  const emojiRegex = /^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}]+$/u;
  
  // Also check that it's not just a regular character, number, or symbol
  const notTextRegex = /^[a-zA-Z0-9\s\p{P}]+$/u;
  
  return emojiRegex.test(str) && !notTextRegex.test(str);
}
