import { useState, useEffect, useMemo } from 'react';
import { Select } from '@moondreamsdev/dreamer-ui/components';
import { TidingCard } from '@components/TidingCard';
import { SkeletonTidingCard } from '@components/SkeletonTidingCard';
import { mockTidings, mockChannels } from '@lib/mockData';

type SortOrder = 'newest' | 'oldest';

export function Feed() {
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [displayedCount, setDisplayedCount] = useState(5);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter and sort tidings
  const filteredAndSortedTidings = useMemo(() => {
    const filtered =
      selectedChannel === 'all'
        ? mockTidings
        : mockTidings.filter((tiding) => tiding.channelId === selectedChannel);

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp - a.timestamp;
      }

      return a.timestamp - b.timestamp;
    });

    return sorted;
  }, [selectedChannel, sortOrder]);

  // Get currently displayed tidings
  const displayedTidings = useMemo(() => {
    const result = filteredAndSortedTidings.slice(0, displayedCount);

    return result;
  }, [filteredAndSortedTidings, displayedCount]);

  const hasMore = displayedCount < filteredAndSortedTidings.length;

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

  // Channel options for Select
  const channelOptions = [
    { text: 'All Channels', value: 'all' },
    ...mockChannels.map((channel) => ({
      text: channel.name,
      value: channel.id,
    })),
  ];

  // Sort options for Select
  const sortOptions = [
    { text: 'Newest First', value: 'newest' },
    { text: 'Oldest First', value: 'oldest' },
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

  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-2xl px-4 py-6 space-y-6'>
        {/* Header */}
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold text-foreground'>Tidings</h1>
          <p className='text-foreground/60'>Stay connected with family updates</p>
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
              options={sortOptions}
              value={sortOrder}
              onChange={handleSortChange}
              placeholder='Sort by'
              className='w-full'
            />
          </div>
        </div>

        {/* Feed */}
        <div className='space-y-4'>
          {displayedTidings.map((tiding) => (
            <TidingCard key={tiding.id} tiding={tiding} />
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
    </div>
  );
}

export default Feed;
