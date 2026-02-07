import { Avatar, Badge, Card, Carousel } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import type { Tiding } from '@lib/mockData';

interface TidingCardProps {
  tiding: Tiding;
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

export function TidingCard({ tiding }: TidingCardProps) {
  const relativeTime = getRelativeTime(tiding.timestamp);

  return (
    <Card className='p-0 overflow-hidden'>
      {/* Header */}
      <div className='p-4 space-y-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Avatar preset={tiding.authorAvatar} size='md' />
            <div className='flex flex-col'>
              <span className='font-semibold text-foreground'>{tiding.authorName}</span>
              <span className='text-sm text-foreground/60'>{relativeTime}</span>
            </div>
          </div>
          <Badge
            variant='secondary'
            className={join('text-xs font-medium', tiding.isHighPriority && 'border-2')}
            style={{ borderColor: tiding.channelColor }}
          >
            {tiding.channelName}
          </Badge>
        </div>

        {/* Text Content */}
        <p className='text-foreground leading-relaxed whitespace-pre-wrap'>{tiding.text}</p>
      </div>

      {/* Media Area */}
      {tiding.images.length > 0 && (
        <div className='w-full'>
          {tiding.images.length === 1 ? (
            <img
              src={tiding.images[0]}
              alt='Post content'
              className='w-full h-auto object-cover'
              loading='lazy'
            />
          ) : (
            <Carousel className='w-full'>
              {tiding.images.map((image, index) => (
                <div key={`${tiding.id}-image-${index}`} className='w-full'>
                  <img
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className='w-full h-auto object-cover'
                    loading='lazy'
                  />
                </div>
              ))}
            </Carousel>
          )}
        </div>
      )}
    </Card>
  );
}
