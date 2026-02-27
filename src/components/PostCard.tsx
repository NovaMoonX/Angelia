import { CHANNEL_COLOR_MAP, DEFAULT_CHANNEL_COLOR } from '@lib/channelColors';
import {
  Avatar,
  Badge,
  Card,
  Carousel,
} from '@moondreamsdev/dreamer-ui/components';
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelativeTime } from '@lib/timeUtils';
import { Post } from '@/lib/post';
import { useAppSelector } from '@/store/hooks';
import { selectChannelMapById } from '@/store/slices/channelsSlice';
import { selectAllUsersMapById } from '@/store/slices/usersSlice';

interface PostCardProps {
  post: Post;
  onNavigate?: () => void;
}

export function PostCard({ post, onNavigate }: PostCardProps) {
  const navigate = useNavigate();
  const channelMapById = useAppSelector(selectChannelMapById)
  const allUsersMapById = useAppSelector(selectAllUsersMapById)
  const relativeTime = getRelativeTime(post.timestamp);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());

  const getColorPair = () => {
    const channel = channelMapById[post.channelId];
    const postChannelColor = channel?.color || DEFAULT_CHANNEL_COLOR;
    const colorData = CHANNEL_COLOR_MAP.get(postChannelColor);
    return {
      backgroundColor: colorData?.value || '#c7d2fe',
      textColor: colorData?.textColor || '#4338ca',
    };
  };

  const colors = getColorPair();

  // Use media array if available, otherwise fall back to images
  const mediaItems = useMemo(() => {
    return post.media ?? []
  }, [post.media]);

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
    navigate(`/post/${post.id}`);
  };

  const postUser = allUsersMapById[post.authorId];
  const postChannel = channelMapById[post.channelId];

  const getPostUserName = () => {
    if (!postUser) return 'Unknown User';
    let name = `${postUser.firstName} ${postUser.lastName}`;

    if (postUser.id === post.authorId) {
      name += ' (You)';
    }
    return name;
  }
  return (
    <div
      className='cursor-pointer transition-all hover:shadow-lg'
      onClick={handleClick}
    >
      <Card className='relative overflow-hidden p-0'>
      {/* Header */}
      <div className='space-y-3 p-4'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Avatar preset={postUser?.avatar} size='md' />
            <div className='flex flex-col'>
              <span className='text-foreground font-semibold'>
                {getPostUserName()}
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
            {postChannel?.name || 'Unknown Channel'}
          </Badge>
        </div>

        {/* Text Content */}
        <p className='text-foreground leading-relaxed whitespace-pre-wrap'>
          {post.text}
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
                <div key={`${post.id}-media-${index}`} className='w-full'>
                  {item.type === 'video' ? (
                    <div className='relative w-full bg-black flex items-center justify-center min-h-100'>
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
                        className='h-auto w-full max-h-150'
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
