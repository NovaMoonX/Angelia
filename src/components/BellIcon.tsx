import { join } from '@moondreamsdev/dreamer-ui/utils';

interface BellIconProps {
  className?: string;
  hasNotification?: boolean;
}

export function BellIcon({ className, hasNotification = false }: BellIconProps) {
  return (
    <div className='relative inline-flex'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={join('w-6 h-6', className)}
        aria-hidden='true'
      >
        <path d='M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9' />
        <path d='M13.73 21a2 2 0 0 1-3.46 0' />
      </svg>
      {hasNotification && (
        <span
          className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background'
          aria-label='Has unread notifications'
        />
      )}
    </div>
  );
}
