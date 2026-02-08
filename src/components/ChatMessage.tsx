import { Avatar } from '@moondreamsdev/dreamer-ui/components';
import type { AvatarPreset } from '@lib/mockData';
import { getRelativeTime } from '@lib/timeUtils';

interface ChatMessageProps {
  authorName: string;
  authorAvatar: AvatarPreset;
  text: string;
  timestamp: number;
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
