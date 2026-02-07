import { Card, Skeleton } from '@moondreamsdev/dreamer-ui/components';

export function SkeletonTidingCard() {
  return (
    <Card className='p-0 overflow-hidden'>
      {/* Header */}
      <div className='p-4 space-y-3'>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex items-center gap-3'>
            <Skeleton shape='circle' className='w-12 h-12' />
            <div className='flex flex-col gap-2'>
              <Skeleton className='w-32 h-4' />
              <Skeleton className='w-16 h-3' />
            </div>
          </div>
          <Skeleton className='w-24 h-6 rounded-xl' />
        </div>

        {/* Text Content */}
        <div className='space-y-2'>
          <Skeleton className='w-full h-4' />
          <Skeleton className='w-11/12 h-4' />
          <Skeleton className='w-3/4 h-4' />
        </div>
      </div>

      {/* Media Area */}
      <Skeleton className='w-full h-80 rounded-none' />
    </Card>
  );
}
