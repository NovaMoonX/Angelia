import { Avatar } from '@moondreamsdev/dreamer-ui/components';
import type { AvatarPreset } from '@lib/mockData';

interface ChatMessageProps {
  authorName: string;
  authorAvatar: AvatarPreset;
  text: string;
  timestamp: number;
}

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days}d ago`;
  }
  if (hours > 0) {
    return `${hours}h ago`;
  }
  if (minutes > 0) {
    return `${minutes}m ago`;
  }

  return 'Just now';
}

export function ChatMessage({
  authorName,
  authorAvatar,
  text,
  timestamp,
}: ChatMessageProps) {
  const relativeTime = getRelativeTime(timestamp);

  return (
    <div className='flex gap-3 py-3'>
      <Avatar preset={authorAvatar} size='sm' />
      <div className='flex-1 min-w-0'>
        <div className='flex items-baseline gap-2'>
          <span className='text-foreground font-semibold text-sm'>
            {authorName}
          </span>
          <span className='text-foreground/40 text-xs'>{relativeTime}</span>
        </div>
        <p className='text-foreground/80 text-sm mt-1 whitespace-pre-wrap break-words'>
          {text}
        </p>
      </div>
    </div>
  );
}
