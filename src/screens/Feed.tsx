import { useState, useEffect, useMemo, useRef } from 'react';
import { Select, Avatar, Callout, Button } from '@moondreamsdev/dreamer-ui/components';
import { ChevronUp } from '@moondreamsdev/dreamer-ui/symbols';
import { TidingCard } from '@components/TidingCard';
import { SkeletonTidingCard } from '@components/SkeletonTidingCard';
import { mockTidings, mockChannels, mockCurrentUser } from '@lib/mockData';
import { Link, useLocation } from 'react-router-dom';

type SortOrder = 'newest' | 'oldest';
type PriorityFilter = 'all' | 'high';

const CALLOUT_DISMISSED_KEY = 'angelia_feed_callout_dismissed';

export function Feed() {
  const location = useLocation();
  const locationState = location.state as { scrollPosition?: number; displayedCount?: number } | null;
  
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [displayedCount, setDisplayedCount] = useState(locationState?.displayedCount ?? 5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCalloutDismissed, setIsCalloutDismissed] = useState(() => {
    const dismissed = localStorage.getItem(CALLOUT_DISMISSED_KEY);
    return dismissed === 'true';
  });
  
  const hasRestoredScroll = useRef(false);
  const firstPostRef = useRef<HTMLDivElement>(null);
  const secondPostRef = useRef<HTMLDivElement>(null);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [firstPostVisible, setFirstPostVisible] = useState(true);
  const [secondPostVisible, setSecondPostVisible] = useState(true);

  // Filter and sort tidings
  const filteredAndSortedTidings = useMemo(() => {
    let filtered = mockTidings;

    // Filter by channel
    if (selectedChannel === 'daily') {
      // Show all daily channel posts
      filtered = filtered.filter((tiding) => tiding.isDaily);
    } else if (selectedChannel !== 'all') {
      filtered = filtered.filter((tiding) => tiding.channelId === selectedChannel);
    }

    // Filter by priority
    if (priorityFilter === 'high') {
      filtered = filtered.filter((tiding) => tiding.isHighPriority);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp - a.timestamp;
      }

      return a.timestamp - b.timestamp;
    });

    return sorted;
  }, [selectedChannel, sortOrder, priorityFilter]);

  // Get currently displayed tidings
  const displayedTidings = useMemo(() => {
    const result = filteredAndSortedTidings.slice(0, displayedCount);

    return result;
  }, [filteredAndSortedTidings, displayedCount]);

  const hasMore = displayedCount < filteredAndSortedTidings.length;

  // Restore scroll position when returning from post detail
  useEffect(() => {
    if (locationState?.scrollPosition !== undefined && !hasRestoredScroll.current) {
      // Use setTimeout to ensure DOM is ready
      const scrollPosition = locationState.scrollPosition;
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
        hasRestoredScroll.current = true;
      }, 0);
    }
  }, [locationState?.scrollPosition]);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;

      if (isNearBottom && hasMore && !isLoadingMore) {
        setIsLoadingMore(true);

        // Simulate loading delay
        setTimeout(() => {
          setDisplayedCount((prev) => prev + 3);
          setIsLoadingMore(false);
        }, 2000);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasMore, isLoadingMore]);

  // Intersection Observer to track when first two posts are out of view
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.target === firstPostRef.current) {
          setFirstPostVisible(entry.isIntersecting);
        }
        if (entry.target === secondPostRef.current) {
          setSecondPostVisible(entry.isIntersecting);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe first two posts after media loads
    const observePostsWithMediaLoad = () => {
      if (firstPostRef.current) {
        const firstPostImages = firstPostRef.current.querySelectorAll('img, video');
        if (firstPostImages.length > 0) {
          // Wait for all media to load before observing
          const mediaPromises = Array.from(firstPostImages).map((media) => {
            return new Promise((resolve) => {
              if (media instanceof HTMLImageElement) {
                if (media.complete) {
                  resolve(true);
                } else {
                  media.addEventListener('load', () => resolve(true), { once: true });
                  media.addEventListener('error', () => resolve(true), { once: true });
                }
              } else if (media instanceof HTMLVideoElement) {
                if (media.readyState >= 2) {
                  resolve(true);
                } else {
                  media.addEventListener('loadeddata', () => resolve(true), { once: true });
                  media.addEventListener('error', () => resolve(true), { once: true });
                }
              }
            });
          });

          Promise.all(mediaPromises).then(() => {
            if (firstPostRef.current) {
              observer.observe(firstPostRef.current);
            }
          });
        } else {
          observer.observe(firstPostRef.current);
        }
      }

      if (secondPostRef.current) {
        const secondPostImages = secondPostRef.current.querySelectorAll('img, video');
        if (secondPostImages.length > 0) {
          const mediaPromises = Array.from(secondPostImages).map((media) => {
            return new Promise((resolve) => {
              if (media instanceof HTMLImageElement) {
                if (media.complete) {
                  resolve(true);
                } else {
                  media.addEventListener('load', () => resolve(true), { once: true });
                  media.addEventListener('error', () => resolve(true), { once: true });
                }
              } else if (media instanceof HTMLVideoElement) {
                if (media.readyState >= 2) {
                  resolve(true);
                } else {
                  media.addEventListener('loadeddata', () => resolve(true), { once: true });
                  media.addEventListener('error', () => resolve(true), { once: true });
                }
              }
            });
          });

          Promise.all(mediaPromises).then(() => {
            if (secondPostRef.current) {
              observer.observe(secondPostRef.current);
            }
          });
        } else {
          observer.observe(secondPostRef.current);
        }
      }
    };

    // Use setTimeout to ensure DOM is ready
    setTimeout(observePostsWithMediaLoad, 100);

    return () => {
      observer.disconnect();
    };
  }, [displayedTidings]);

  // Show/hide scroll to top button based on visibility of first two posts
  useEffect(() => {
    setShowScrollToTop(!firstPostVisible && !secondPostVisible);
  }, [firstPostVisible, secondPostVisible]);

  // Channel options for Select
  const channelOptions = [
    { text: 'All Channels', value: 'all' },
    { text: 'Daily Updates', value: 'daily' },
    ...mockChannels
      .filter((channel) => !channel.isDaily)
      .map((channel) => ({
        text: channel.name,
        value: channel.id,
      })),
  ];

  // Sort options for Select
  const sortOptions = [
    { text: 'Newest First', value: 'newest' },
    { text: 'Oldest First', value: 'oldest' },
  ];

  // Priority filter options for Select
  const priorityOptions = [
    { text: 'All Posts', value: 'all' },
    { text: 'High Priority Only', value: 'high' },
  ];

  // Handler for channel change
  const handleChannelChange = (value: string) => {
    setSelectedChannel(value);
    setDisplayedCount(5);
  };

  // Handler for sort change
  const handleSortChange = (value: string) => {
    setSortOrder(value as SortOrder);
    setDisplayedCount(5);
  };

  // Handler for priority filter change
  const handlePriorityFilterChange = (value: string) => {
    setPriorityFilter(value as PriorityFilter);
    setDisplayedCount(5);
  };

  // Handler for callout dismiss
  const handleCalloutDismiss = () => {
    localStorage.setItem(CALLOUT_DISMISSED_KEY, 'true');
    setIsCalloutDismissed(true);
  };

  // Save scroll position before navigating to post
  const saveScrollPosition = () => {
    const scrollPosition = window.scrollY;
    // Store in sessionStorage as backup
    sessionStorage.setItem('feedScrollPosition', String(scrollPosition));
    sessionStorage.setItem('feedDisplayedCount', String(displayedCount));
  };

  // Scroll to top handler
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-2xl px-4 py-6 space-y-6'>
        {/* Header */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-foreground'>Tidings</h1>
              <p className='text-foreground/60'>Stay connected with family updates</p>
            </div>
            <Link
              to='/account'
              aria-label='Go to account'
              className='focus:outline-none focus:ring-2 focus:ring-primary rounded-full'
            >
              <Avatar preset={mockCurrentUser.avatar} size='md' />
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-3'>
          <div className='flex-1'>
            <Select
              options={channelOptions}
              value={selectedChannel}
              onChange={handleChannelChange}
              placeholder='Filter by channel'
              className='w-full'
            />
          </div>
          <div className='flex-1'>
            <Select
              options={priorityOptions}
              value={priorityFilter}
              onChange={handlePriorityFilterChange}
              placeholder='Filter by priority'
              className='w-full'
            />
          </div>
          <div className='flex-1'>
            <Select
              options={sortOptions}
              value={sortOrder}
              onChange={handleSortChange}
              placeholder='Sort by'
              className='w-full'
            />
          </div>
        </div>

        {/* Helpful Callout */}
        {!isCalloutDismissed && (
          <Callout
            variant='info'
            description={<span className='text-blue-500'>Click on any post to see more details, react with emojis, and join the conversation!</span>}
            dismissible
            onDismiss={handleCalloutDismiss}
          />
        )}

        {/* Feed */}
        <div className='space-y-4'>
          {displayedTidings.map((tiding, index) => (
            <div
              key={tiding.id}
              ref={index === 0 ? firstPostRef : index === 1 ? secondPostRef : null}
            >
              <TidingCard 
                tiding={tiding} 
                onNavigate={saveScrollPosition}
              />
            </div>
          ))}

          {/* Loading skeletons */}
          {isLoadingMore &&
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonTidingCard key={`skeleton-${index}`} />
            ))}

          {/* End of feed message */}
          {!hasMore && displayedTidings.length > 0 && (
            <div className='text-center py-8 text-foreground/60'>
              <p>You've caught up with all tidings</p>
            </div>
          )}

          {/* Empty state */}
          {displayedTidings.length === 0 && !isLoadingMore && (
            <div className='text-center py-12 space-y-2'>
              <p className='text-lg text-foreground/60'>No tidings found</p>
              <p className='text-sm text-foreground/40'>
                Try selecting a different channel or check back later
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Button
          variant='primary'
          onClick={scrollToTop}
          className='fixed bottom-6 right-6 z-50 h-14 w-14 !rounded-3xl p-0 shadow-lg transition-all hover:shadow-xl hover:scale-110'
          aria-label='Scroll to top'
        >
          <ChevronUp className='h-8 w-8' />
        </Button>
      )}
    </div>
  );
}

export default Feed;
