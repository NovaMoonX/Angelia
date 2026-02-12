import { useAuth } from '@/hooks/useAuth';
import { Button } from '@moondreamsdev/dreamer-ui/components';
import { useNavigate } from 'react-router-dom';

export default function ErrorFallback() {
  const navigate = useNavigate();
  const { firebaseUser, signOut } = useAuth();

  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <div className='text-center'>
        <h1 className='text-foreground text-4xl font-bold'>
          Something went wrong
        </h1>
        <p className='text-muted-foreground mt-4 text-sm'>
          An unexpected error occurred.
        </p>

        <div className='space-y-2'>
          <div className='mt-6 flex justify-center gap-3'>
            <Button href='/' variant='secondary'>
              Go home
            </Button>

            <Button
              onClick={() => {
                document.location.reload();
              }}
              variant='primary'
            >
              Try again
            </Button>
          </div>
          {firebaseUser && (
            <Button
              onClick={() => {
                signOut();
                navigate('/auth');
                document.location.reload();
              }}
              variant='tertiary'
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
