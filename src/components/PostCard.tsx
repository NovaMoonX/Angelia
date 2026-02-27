import { getColorPair } from '@/lib/channel';
import { getPostAuthorName, Post } from '@/lib/post';
import { useAppSelector } from '@/store/hooks';
import { selectPostAuthor, selectPostChannel } from '@/store/slices/postsSlice';
import { getRelativeTime } from '@lib/timeUtils';
import {
  Avatar,
  Badge,
  Card,
  Carousel,
} from '@moondreamsdev/dreamer-ui/components';
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  post: Post;
  onNavigate?: () => void;
}

export function PostCard({ post, onNavigate }: PostCardProps) {
  const navigate = useNavigate();
  const relativeTime = getRelativeTime(post.timestamp);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const postAuthor = useAppSelector((state) => selectPostAuthor(state, post));
  const postChannel = useAppSelector((state) => selectPostChannel(state, post));

  const colors = getColorPair(postChannel);

  // Use media array if available, otherwise fall back to images
  const mediaItems = useMemo(() => {
    return post.media ?? [];
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
    const isCarouselControl = target.closest(
      '[data-carousel-prev], [data-carousel-next], [data-carousel-dot]',
    );
    const isVideo = target.closest('video');

    if (isCarouselControl || isVideo) {
      return;
    }

    if (onNavigate) {
      onNavigate();
    }
    navigate(`/post/${post.id}`);
  };

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
              <Avatar preset={postAuthor?.avatar} size='md' />
              <div className='flex flex-col'>
                <span className='text-foreground font-semibold'>
                  {getPostAuthorName(postAuthor, currentUser)}
                </span>
                <span className='text-foreground/60 text-sm'>
                  {relativeTime}
                </span>
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
        {mediaItems.length > 0 &&
          (mediaItems.length === 1 ? (
            <div className='w-full'>
              {mediaItems[0].type === 'video' ? (
                <div className='relative flex w-full items-center justify-center bg-black'>
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
                      <div className='relative flex min-h-100 w-full items-center justify-center bg-black'>
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
                          className='h-auto max-h-150 w-full'
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
          ))}
      </Card>
    </div>
  );
}
