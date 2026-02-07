export function ComparisonTable({ className = '' }: { className?: string }) {
  const CheckMark = () => (
    <span 
      className='inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/20 text-accent'
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
        className='w-5 h-5'
        aria-hidden='true'
      >
        <polyline points='20 6 9 17 4 12' />
      </svg>
    </span>
  );

  const EmptyCircle = () => (
    <span 
      className='inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-foreground/20'
      aria-label='Not supported'
      role='img'
    >
    </span>
  );

  return (
    <div className={className}>
      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='border-b-2 border-foreground/20'>
              <th className='text-left py-4 px-4 font-semibold text-foreground/80'>Use Case</th>
              <th className='text-center py-4 px-4 font-semibold text-foreground'>Group Chats</th>
              <th className='text-center py-4 px-4 font-semibold text-foreground'>Social Media</th>
              <th className='text-center py-4 px-4 font-bold text-accent'>Angelia</th>
            </tr>
          </thead>
          <tbody>
            <tr className='border-b border-foreground/10'>
              <td className='py-4 px-4 text-foreground/70'>Quick coordination</td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
            </tr>
            <tr className='border-b border-foreground/10'>
              <td className='py-4 px-4 text-foreground/70'>Share once, reach everyone</td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
            </tr>
            <tr className='border-b border-foreground/10'>
              <td className='py-4 px-4 text-foreground/70'>Organized updates</td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
            </tr>
            <tr className='border-b border-foreground/10'>
              <td className='py-4 px-4 text-foreground/70'>Private & family-focused</td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
            </tr>
            <tr className='border-b border-foreground/10'>
              <td className='py-4 px-4 text-foreground/70'>Subscribe to topics</td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
            </tr>
            <tr className='border-b border-foreground/10'>
              <td className='py-4 px-4 text-foreground/70'>Temporary updates</td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
            </tr>
            <tr className='border-b border-foreground/10'>
              <td className='py-4 px-4 text-foreground/70'>No algorithm distraction</td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
              <td className='text-center py-4 px-4'><EmptyCircle /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
            </tr>
            <tr className='border-b border-foreground/10'>
              <td className='py-4 px-4 text-foreground/70'>Share life updates</td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
              <td className='text-center py-4 px-4'><CheckMark /></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className='text-sm text-center text-foreground/60 mt-6 italic'>
        Angelia doesn't replace group chats or social media—it fills the gap for intentional family connection.
      </p>
    </div>
  );
}
