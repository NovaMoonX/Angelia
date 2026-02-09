import { CHANNEL_COLOR_MAP } from '@lib/channelColors';
import type { Tiding } from '@lib/mockData';
import {
  Avatar,
  Badge,
  Card,
  Carousel,
} from '@moondreamsdev/dreamer-ui/components';
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelativeTime } from '@lib/timeUtils';

interface TidingCardProps {
  tiding: Tiding;
  onNavigate?: () => void;
}

export function TidingCard({ tiding, onNavigate }: TidingCardProps) {
  const navigate = useNavigate();
  const relativeTime = getRelativeTime(tiding.timestamp);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const getColorPair = () => {
    const colorData = CHANNEL_COLOR_MAP.get(tiding.channelColor);
    return {
      backgroundColor: colorData?.value || '#c7d2fe',
      textColor: colorData?.textColor || '#4338ca',
    };
  };

  const colors = getColorPair();

  // Use media array if available, otherwise fall back to images
  const mediaItems = useMemo(() => {
    return tiding.media || tiding.images.map(url => ({ type: 'image' as const, url }));
  }, [tiding.media, tiding.images]);

  const handleCarouselIndexChange = (newIndex: number) => {
    // Pause all videos when carousel index changes
    videoRefs.current.forEach((video, index) => {
      if (index !== newIndex && !video.paused) {
        video.pause();
      }
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent navigation if clicking carousel controls or video elements
    const target = e.target as HTMLElement;
    const isCarouselControl = target.closest('[data-carousel-prev], [data-carousel-next], [data-carousel-dot]');
    const isVideo = target.closest('video');
    
    if (isCarouselControl || isVideo) {
      return;
    }

    if (onNavigate) {
      onNavigate();
    }
    navigate(`/tiding/${tiding.id}`);
  };

  return (
    <div
      className='cursor-pointer transition-all hover:shadow-lg'
      onClick={handleClick}
    >
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
      {mediaItems.length > 0 && (
        mediaItems.length === 1 ? (
          <div className='w-full'>
            {mediaItems[0].type === 'video' ? (
              <div className='relative w-full bg-black flex items-center justify-center'>
                <video
                  src={mediaItems[0].url}
                  controls
                  className='h-auto w-full'
                  preload='metadata'
                />
              </div>
            ) : (
              <img
                src={mediaItems[0].url}
                alt='Post content'
                className='h-auto w-full object-cover'
                loading='lazy'
              />
            )}
          </div>
        ) : (
          <div className='w-full'>
            <Carousel 
              className='w-full' 
              buttonPosition='interior'
              onIndexChange={handleCarouselIndexChange}
            >
              {mediaItems.map((item, index) => (
                <div key={`${tiding.id}-media-${index}`} className='w-full'>
                  {item.type === 'video' ? (
                    <div className='relative w-full bg-black flex items-center justify-center min-h-[400px]'>
                      <video
                        ref={(el) => {
                          if (el) {
                            videoRefs.current.set(index, el);
                          } else {
                            videoRefs.current.delete(index);
                          }
                        }}
                        src={item.url}
                        controls
                        className='h-auto w-full max-h-[600px]'
                        preload='metadata'
                      />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={`Post content ${index + 1}`}
                      className='h-auto w-full object-cover'
                      loading='lazy'
                    />
                  )}
                </div>
              ))}
            </Carousel>
          </div>
        )
      )}
    </Card>
    </div>
  );
}
