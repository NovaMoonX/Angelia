import { Avatar } from '@moondreamsdev/dreamer-ui/components';
import { getUserById } from '@lib/mockData';
import { getRelativeTime } from '@lib/timeUtils';
import { join } from '@moondreamsdev/dreamer-ui/utils';

interface ChatMessageProps {
  authorId: string;
  text: string;
  timestamp: number;
  isCurrentUser?: boolean;
}

export function ChatMessage({
  authorId,
  text,
  timestamp,
  isCurrentUser = false,
}: ChatMessageProps) {
  const relativeTime = getRelativeTime(timestamp);
  const author = getUserById(authorId);

  if (!author) {
    return null;
  }

  return (
    <div
      className={join(
        'flex gap-3 py-2',
        isCurrentUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar preset={author.avatar} size='sm' className='shrink-0' />
      <div
        className={join(
          'flex flex-col gap-1 max-w-[70%]',
          isCurrentUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={join(
            'flex items-baseline gap-2 text-xs',
            isCurrentUser ? 'flex-row-reverse' : 'flex-row'
          )}
        >
          <span className='text-foreground font-semibold'>
            {author.firstName} {author.lastName}
          </span>
          <span className='text-foreground/40'>{relativeTime}</span>
        </div>
        <div
          className={join(
            'px-4 py-2 rounded-2xl break-words',
            isCurrentUser
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted text-foreground rounded-tl-sm'
          )}
        >
          <p className='text-sm whitespace-pre-wrap'>{text}</p>
        </div>
      </div>
    </div>
  );
}
