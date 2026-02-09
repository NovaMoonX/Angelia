import { Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { useAppDispatch } from '@store/hooks';
import { exitDemoMode } from '@store/demoActions';
import { useNavigate } from 'react-router-dom';

export function DemoModeBanner() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleEndDemoMode = () => {
    dispatch(exitDemoMode());
    navigate('/');
  };

  return (
    <div
      className={join(
        'bg-accent text-accent-foreground',
        'fixed top-0 left-0 right-0 z-50',
        'flex items-center justify-center gap-4',
        'px-4 py-3',
        'shadow-md'
      )}
    >
      <p className='text-sm font-medium md:text-base'>
        🎭 Demo Mode Active - Exploring with sample data
      </p>
      <Button
        onClick={handleEndDemoMode}
        variant='secondary'
        size='sm'
        className='text-xs md:text-sm'
      >
        End Demo Mode
      </Button>
    </div>
  );
}
