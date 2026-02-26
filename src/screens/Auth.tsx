import { useState } from 'react';
import {
  AuthForm,
  Callout,
  Button,
  type AuthFormOnEmailSubmit,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { REDIRECT_PARAM } from '@lib/app/app.constants';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { enterDemoMode } from '@store/actions/demoActions';
import { fetchUserProfile } from '@store/actions/userActions';
import { useAuth } from '@hooks/useAuth';
import { getAuthErrorMessage } from '@/util/firebaseAuth';
import Loading from '@ui/Loading';

type AuthMode = 'login' | 'signup';

export function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { firebaseUser, signIn, signUp, signOut, loading } = useAuth();
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Get initial mode from query params, default to login
  const authMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  // Get redirect URL from query params
  const redirectUrl = searchParams.get(REDIRECT_PARAM) || null;

  // Update query params when mode changes
  const handleModeChange = (newMode: 'login' | 'sign up') => {
    const authMode: AuthMode = newMode === 'sign up' ? 'signup' : 'login';
    const params: Record<string, string> = { mode: authMode };

    // Preserve redirect parameter if it exists
    if (redirectUrl) {
      params[REDIRECT_PARAM] = redirectUrl;
    }

    setSearchParams(params);
    // Update URL in next tick to avoid React warning
    setTimeout(() => {
      setSearchParams(params);
    }, 0);
  };

  const handleDemoFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(enterDemoMode());
    navigate('/feed');
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Show loading state while Firebase user is being loaded
  if (loading) {
    return <Loading />;
  }

  // Show logged-in user state while checking redirect conditions
  // Don't show if we're in the middle of authenticating
  if (firebaseUser && !isAuthenticating) {
    const profileComplete = currentUser?.accountProgress?.signUpComplete;
    const emailVerified = firebaseUser.emailVerified;

    let title = 'You\'re Already Logged In';
    let description = '';
    let ctaText = '';
    let ctaAction = () => {};

    if (!currentUser || !profileComplete) {
      title = 'Complete Your Profile';
      description = 'You need to finish setting up your profile before you can continue.';
      ctaText = 'Complete Profile';
      ctaAction = () => {
        const destination = redirectUrl
          ? `/complete-profile?${REDIRECT_PARAM}=${encodeURIComponent(redirectUrl)}`
          : '/complete-profile';
        navigate(destination);
      };
    } else if (!emailVerified) {
      title = 'Verify Your Email';
      description = 'Please verify your email address to continue using Angelia.';
      ctaText = 'Go to Verification';
      ctaAction = () => {
        const destination = redirectUrl
          ? `/verify-email?${REDIRECT_PARAM}=${encodeURIComponent(redirectUrl)}`
          : '/verify-email';
        navigate(destination);
      };
    } else {
      title = 'You\'re All Set!';
      description = 'Your account is ready to go. Head to your feed or log out to switch accounts.';
      ctaText = 'Go to Feed';
      ctaAction = () => navigate(redirectUrl || '/feed');
    }

    return (
      <div className='page flex items-center justify-center p-6'>
        <div className='w-full max-w-md space-y-8'>
          <div className='flex flex-col items-center space-y-4'>
            <Link to='/'>
              <AngeliaLogo className='h-20 w-20 cursor-pointer transition-opacity hover:opacity-80' />
            </Link>
            <h1 className='text-foreground text-3xl font-bold'>{title}</h1>
            <p className='text-foreground/70 text-center'>{description}</p>
          </div>

          <div className='space-y-4'>
            <Button onClick={ctaAction} className='w-full'>
              {ctaText}
            </Button>
            <Button
              onClick={handleLogout}
              variant='tertiary'
              className='w-full'
            >
              Log Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAuthSubmit = async ({
    data,
    action,
  }: Parameters<AuthFormOnEmailSubmit>[0]): Promise<{
    error?: { message: string };
  }> => {
    setIsAuthenticating(true);
    try {
      if (action === 'login') {
        // Sign in with Firebase
        const firebaseUser = await signIn(data.email, data.password);

        // Fetch user profile from Firestore and set in Redux using thunk
        await dispatch(fetchUserProfile(firebaseUser.uid));

        // After successful login, redirect to the specified URL or default to feed
        navigate(redirectUrl || '/feed');
      } else {
        // For signup, create Firebase account and redirect to profile completion
        await signUp(data.email, data.password);

        // Redirect to profile completion screen, preserving redirect URL if present
        if (redirectUrl) {
          navigate(
            `/complete-profile?${REDIRECT_PARAM}=${encodeURIComponent(redirectUrl)}`,
            { replace: true },
          );
        } else {
          navigate('/complete-profile', { replace: true });
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = getAuthErrorMessage(err);
      setIsAuthenticating(false);
      return { error: { message: errorMessage } };
    }

    return {};
  };

  return (
    <div className='page flex items-center justify-center p-6'>
      <div className='w-full max-w-md space-y-8'>
        {/* Logo and Welcome Text */}
        <div className='flex flex-col items-center space-y-4'>
          <Link to='/'>
            <AngeliaLogo className='h-20 w-20 cursor-pointer transition-opacity hover:opacity-80' />
          </Link>
          <div className='space-y-2 text-center'>
            <h1 className='text-foreground text-3xl font-bold'>
              {authMode === 'signup' ? 'Create Account' : 'Sign In'}
            </h1>
            <p className='text-foreground/70'>
              {authMode === 'signup'
                ? 'Join Angelia to connect with your family'
                : 'Welcome back to Angelia'}
            </p>
          </div>
          <Callout
            variant='info'
            icon='👀'
            description={
              <>
                <span className='text-foreground'>
                  Want to see the app in action?{' '}
                </span>
                <Link
                  to='/feed'
                  onClick={handleDemoFeedClick}
                  className={join(
                    'text-accent hover:text-accent/80',
                    'font-medium underline transition-colors',
                  )}
                >
                  Head straight to the demo feed →
                </Link>
              </>
            }
          />
        </div>

        {/* AuthForm */}
        <AuthForm
          methods={['email', 'google']}
          action='both'
          onActionChange={handleModeChange}
          onEmailSubmit={handleAuthSubmit}
          className='space-y-6'
        />
      </div>
    </div>
  );
}

export default Auth;
