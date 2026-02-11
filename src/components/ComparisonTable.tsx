const CheckMark = () => (
  <span
    className='bg-accent/20 text-accent inline-flex h-8 w-8 items-center justify-center rounded-full'
    aria-label='Supported'
    role='img'
  >
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='h-5 w-5'
      aria-hidden='true'
    >
      <polyline points='20 6 9 17 4 12' />
    </svg>
  </span>
);

const EmptyCircle = () => (
  <span
    className='border-foreground/20 inline-flex h-8 w-8 items-center justify-center rounded-full border-2'
    aria-label='Not supported'
    role='img'
  ></span>
);

export function ComparisonTable({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-foreground/20 border-b-2'>
              <th className='text-foreground/80 px-4 py-4 text-left font-semibold'>
                Use Case
              </th>
              <th className='text-foreground px-4 py-4 text-center font-semibold'>
                Group Chats
              </th>
              <th className='text-foreground px-4 py-4 text-center font-semibold'>
                Social Media
              </th>
              <th className='text-accent px-4 py-4 text-center font-bold'>
                Angelia
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-foreground/10 border-b'>
              <td className='text-foreground/70 px-4 py-4'>
                Quick coordination
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
            </tr>
            <tr className='border-foreground/10 border-b'>
              <td className='text-foreground/70 px-4 py-4'>
                Share once, reach everyone
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
            </tr>
            <tr className='border-foreground/10 border-b'>
              <td className='text-foreground/70 px-4 py-4'>
                Organized updates
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
            </tr>
            <tr className='border-foreground/10 border-b'>
              <td className='text-foreground/70 px-4 py-4'>
                Private & family-focused
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
            </tr>
            <tr className='border-foreground/10 border-b'>
              <td className='text-foreground/70 px-4 py-4'>
                Subscribe to topics
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
            </tr>
            <tr className='border-foreground/10 border-b'>
              <td className='text-foreground/70 px-4 py-4'>
                Temporary updates
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
            </tr>
            <tr className='border-foreground/10 border-b'>
              <td className='text-foreground/70 px-4 py-4'>
                No algorithm distraction
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
              <td className='px-4 py-4 text-center'>
                <EmptyCircle />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
            </tr>
            <tr className='border-foreground/10 border-b'>
              <td className='text-foreground/70 px-4 py-4'>
                Share life updates
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
              <td className='px-4 py-4 text-center'>
                <CheckMark />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className='text-foreground/60 mt-6 text-center text-sm italic'>
        Angelia doesn't replace group chats or social media—it fills the gap for
        intentional family connection.
      </p>
    </div>
  );
}
