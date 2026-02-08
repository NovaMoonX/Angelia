import { CHANNEL_COLOR_MAP } from '@lib/channelColors';
import type { Tiding } from '@lib/mockData';
import {
  Avatar,
  Badge,
  Card,
  Carousel,
} from '@moondreamsdev/dreamer-ui/components';

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

  const getColorPair = () => {
    const colorData = CHANNEL_COLOR_MAP.get(tiding.channelColor);
    return {
      backgroundColor: colorData?.value || '#c7d2fe',
      textColor: colorData?.textColor || '#4338ca',
    };
  };

  const colors = getColorPair();

  return (
    <Card className='relative overflow-hidden p-0'>
      {/* High Priority Banner */}
      {tiding.isHighPriority && (
        <div
          className='absolute top-0 left-0 z-10 h-0 w-0 border-b-50 border-l-50 border-b-transparent border-l-red-500'
          aria-label='High priority post'
          role='img'
        >
          <span
            className='absolute -top-11.25 -left-11.25 -rotate-45 transform text-xs font-bold text-white'
            aria-hidden='true'
          >
            !
          </span>
        </div>
      )}

      {/* Header */}
      <div className='space-y-3 p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Avatar preset={tiding.authorAvatar} size='md' />
            <div className='flex flex-col'>
              <span className='text-foreground font-semibold'>
                {tiding.authorName}
              </span>
              <span className='text-foreground/60 text-sm'>{relativeTime}</span>
            </div>
          </div>
          <Badge
            variant='base'
            className='text-xs font-medium'
            style={{
              backgroundColor: colors.backgroundColor,
              borderColor: colors.backgroundColor,
              color: colors.textColor,
            }}
          >
            {tiding.channelName}
          </Badge>
        </div>

        {/* Text Content */}
        <p className='text-foreground leading-relaxed whitespace-pre-wrap'>
          {tiding.text}
        </p>
      </div>

      {/* Media Area */}
      {tiding.images.length > 0 && (
        <div className='w-full'>
          {tiding.images.length === 1 ? (
            <img
              src={tiding.images[0]}
              alt='Post content'
              className='h-auto w-full object-cover'
              loading='lazy'
            />
          ) : (
            <Carousel className='w-full' buttonPosition='interior'>
              {tiding.images.map((image, index) => (
                <div key={`${tiding.id}-image-${index}`} className='w-full'>
                  <img
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className='h-auto w-full object-cover'
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
