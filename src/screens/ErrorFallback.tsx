import { Button } from '@moondreamsdev/dreamer-ui/components';


export default function ErrorFallback() {
  return (
    <div className='flex min-h-screen items-center justify-center px-4'>
      <div className='text-center'>
        <h1 className='text-foreground text-4xl font-bold'>
          Something went wrong
        </h1>
        <p className='text-muted-foreground mt-4 text-sm'>
          An unexpected error occurred.
        </p>

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
      </div>
    </div>
  );
}
