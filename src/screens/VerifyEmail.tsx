import { useState, useEffect } from 'react';
import { Button, Callout } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { REDIRECT_PARAM } from '@lib/app/app.constants';
import { useAuth } from '@hooks/useAuth';

export function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { firebaseUser, sendVerificationEmail } = useAuth();
  const email = firebaseUser?.email || location.state?.email || 'your email';
  const redirectUrl = searchParams.get(REDIRECT_PARAM);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('firebaseUser', firebaseUser); // REMOVE

  // Poll for email verification status every 3 seconds
  useEffect(() => {
    if (!firebaseUser || firebaseUser.emailVerified) return;

    const interval = setInterval(async () => {
      try {
        await firebaseUser.reload();
        // Force re-render by checking emailVerified status
        // The auth state change listener will pick up the update
      } catch (err) {
        console.error('Error reloading user:', err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [firebaseUser]);

  // Check if email is already verified and redirect
  useEffect(() => {
    if (firebaseUser?.emailVerified) {
      const destination = redirectUrl || '/feed';
      const timer = setTimeout(() => {
        navigate(destination);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [firebaseUser, navigate, redirectUrl]);

  // Show notice if email already verified
  if (firebaseUser?.emailVerified) {
    return (
      <div className='page flex items-center justify-center p-6'>
        <div className='w-full max-w-md space-y-8'>
          <div className='flex flex-col items-center space-y-4'>
            <AngeliaLogo className='h-20 w-20' />
            <h1 className='text-foreground text-3xl font-bold'>
              Email Has Been Verified
            </h1>
            <p className='text-foreground/70 text-center'>
              Your email is verified. Redirecting you to your feed...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleResendLink = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setError(null);

    try {
      await sendVerificationEmail();
      console.log('Verification email sent to:', email);
      setResendSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Error sending verification email:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An unknown error occurred while sending the verification email.';
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  // Build the back to login URL with redirect preserved
  const backToLoginUrl = redirectUrl
    ? `/auth?mode=login&${REDIRECT_PARAM}=${encodeURIComponent(redirectUrl)}`
    : '/auth?mode=login';

  return (
    <div className='page flex items-center justify-center p-6'>
      <div className='w-full max-w-md space-y-8'>
        {/* Logo and Title */}
        <div className='flex flex-col items-center space-y-4'>
          <AngeliaLogo className='h-20 w-20' />
          <h1 className='text-foreground text-3xl font-bold'>
            Check Your Email
          </h1>
        </div>

        {/* Verification Message */}
        <div className='space-y-6'>
          <Callout
            variant='info'
            title='Verification link sent!'
            description={
              <span className='text-blue-500'>
                We sent a verification link to <strong>{email}</strong>. Click
                the link in the email to verify your account.
              </span>
            }
          />

          <div className='text-foreground/70 space-y-4 text-center'>
            <p className='text-sm'>
              Didn't receive the email? Check your spam folder or request a new
              link.
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

          {/* Error message */}
          {error && (
            <Callout
              variant='destructive'
              icon='⚠️'
              className='text-left'
              description={error}
            />
          )}

          {/* Resend Button */}
          <Button
            onClick={handleResendLink}
            disabled={isResending}
            className={join(
              'w-full',
              'bg-accent hover:bg-accent/90 text-accent-foreground',
            )}
          >
            {isResending ? 'Sending...' : 'Resend Link'}
          </Button>

          {/* Back to Login */}
          <div className='text-center'>
            <Button href={backToLoginUrl} variant='tertiary' className='w-full'>
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
