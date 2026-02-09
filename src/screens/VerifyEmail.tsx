import { useState, useEffect } from 'react';
import { Button, Callout } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@moondreamsdev/dreamer-ui/hooks';

export function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { currentUser, emailVerified } = useAuth();
  const email = location.state?.email || currentUser?.email || 'your email';
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Redirect to feed if already verified
  useEffect(() => {
    if (emailVerified) {
      navigate('/feed');
    }
  }, [emailVerified, navigate]);

  const handleResendLink = async () => {
    if (!currentUser) {
      toast.addToast({
        title: 'Error',
        description: 'No user found. Please sign in again.',
        type: 'error',
      });
      return;
    }

    setIsResending(true);
    setResendSuccess(false);

    try {
      await sendEmailVerification(currentUser);
      setResendSuccess(true);
      toast.addToast({
        title: 'Email Sent',
        description: 'Verification email sent successfully!',
        type: 'success',
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (err: any) {
      console.error('Resend error:', err);
      const errorMessage = err.code === 'auth/too-many-requests'
        ? 'Too many requests. Please try again later.'
        : 'Failed to send verification email. Please try again.';
      
      toast.addToast({
        title: 'Error',
        description: errorMessage,
        type: 'error',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className='page flex items-center justify-center p-6'>
      <div className='w-full max-w-md space-y-8'>
        {/* Logo and Title */}
        <div className='flex flex-col items-center space-y-4'>
          <AngeliaLogo className='w-20 h-20' />
          <h1 className='text-3xl font-bold text-foreground'>
            Check Your Email
          </h1>
        </div>

        {/* Verification Message */}
        <div className='space-y-6'>
          <Callout 
            variant='info' 
            className='text-left'
            title='Verification link sent!'
            description={
              <>
                We sent a verification link to <strong>{email}</strong>.
                Click the link in the email to verify your account.
              </>
            }
          />

          <div className='space-y-4 text-center text-foreground/70'>
            <p className='text-sm'>
              Didn't receive the email? Check your spam folder or request a new link.
            </p>
          </div>

          {/* Success message */}
          {resendSuccess && (
            <Callout 
              variant='success' 
              className='text-left'
              description='Verification email resent successfully!'
            />
          )}

          {/* Resend Button */}
          <Button
            onClick={handleResendLink}
            disabled={isResending || !currentUser}
            className={join(
              'w-full',
              'bg-accent hover:bg-accent/90 text-accent-foreground'
            )}
          >
            {isResending ? 'Sending...' : 'Resend Link'}
          </Button>

          {/* Back to Login */}
          <div className='text-center'>
            <Button
              href='/auth?mode=login'
              variant='tertiary'
              className='w-full'
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
