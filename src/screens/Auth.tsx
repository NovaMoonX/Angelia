import { useState } from 'react';
import {
  AuthForm,
  Avatar,
  Input,
  Label,
  Button,
  Textarea,
  Callout,
  type AuthFormOnEmailSubmit,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { type AvatarPreset, type User } from '@lib/mockData';
import { REDIRECT_PARAM } from '@lib/app/app.constants';
import { useAppDispatch } from '@store/hooks';
import { enterDemoMode } from '@store/demoActions';

type AuthMode = 'login' | 'signup';

interface ProfileData extends Omit<User, 'id' | 'joinedAt'> {
  password: string;
}

export function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get initial mode from query params, default to login
  const authMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  // Get redirect URL from query params
  const redirectUrl = searchParams.get(REDIRECT_PARAM) || null;
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({
    avatar: 'astronaut', // Default avatar
  });

  const avatarOptions: AvatarPreset[] = [
    'astronaut',
    'moon',
    'star',
    'galaxy',
    'nebula',
    'planet',
    'cosmic-cat',
    'dream-cloud',
    'rocket',
    'constellation',
    'comet',
    'twilight',
  ];

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
    setSignupStep(1); // Reset to step 1 when switching modes
  };

  const handleDemoFeedClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(enterDemoMode());
    navigate('/feed');
  };

  const handleAuthSubmit: AuthFormOnEmailSubmit = ({ data, action }) => {
    console.log('Auth submitted:', { data, action });

    if (action === 'login') {
      // Mock login - would normally authenticate here
      console.log('Login attempt with:', data.email);
      
      // After successful login, redirect to the specified URL or default to feed
      navigate(redirectUrl || '/feed');
    } else {
      // For signup, save data and move to step 2
      setProfileData({
        ...profileData,
        email: data.email,
        password: data.password,
      });
      setSignupStep(2);
    }
  };

  const handleProfileComplete = () => {
    console.log('Profile complete:', profileData);

    // If there's a redirect URL, navigate there directly after signup
    // Otherwise, navigate to verify email
    if (redirectUrl) {
      navigate(redirectUrl);
    } else {
      navigate('/verify-email', { state: { email: profileData.email } });
    }
  };

  // Check if step 2 form is complete
  const isStep2Complete =
    (profileData.firstName?.trim() || '') !== '' &&
    (profileData.lastName?.trim() || '') !== '' &&
    (profileData.funFact?.trim() || '') !== '';

  // Step 2: Profile completion
  if (authMode === 'signup' && signupStep === 2) {
    return (
      <div className='page flex items-center justify-center p-6'>
        <div className='w-full max-w-md space-y-8'>
          {/* Logo and Title */}
          <div className='flex flex-col items-center space-y-4'>
            <Link to='/'>
              <AngeliaLogo className='h-20 w-20 cursor-pointer transition-opacity hover:opacity-80' />
            </Link>
            <h1 className='text-foreground text-3xl font-bold'>
              Complete Your Profile
            </h1>
            <p className='text-foreground/70 text-center'>
              We're excited to have you join our family space!
            </p>
          </div>

          {/* Profile Form */}
          <div className='space-y-6'>
            {/* Name Fields */}
            <div className='space-y-4'>
              <div>
                <Label htmlFor='firstName'>First Name *</Label>
                <Input
                  id='firstName'
                  type='text'
                  value={profileData.firstName || ''}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      firstName: e.target.value,
                    })
                  }
                  placeholder='John'
                  className='mt-2'
                />
              </div>

              <div>
                <Label htmlFor='lastName'>Last Name *</Label>
                <Input
                  id='lastName'
                  type='text'
                  value={profileData.lastName || ''}
                  onChange={(e) =>
                    setProfileData({ ...profileData, lastName: e.target.value })
                  }
                  placeholder='Doe'
                  className='mt-2'
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <Label>Choose Your Avatar *</Label>
              <div className='mt-4 grid grid-cols-4 gap-3'>
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    type='button'
                    onClick={() => setProfileData({ ...profileData, avatar })}
                    className={join(
                      'rounded-lg p-2 transition-all',
                      'hover:bg-accent/20',
                      profileData.avatar === avatar
                        ? 'bg-accent/30 ring-accent ring-2'
                        : 'bg-muted/20',
                    )}
                  >
                    <Avatar preset={avatar} size='lg' shape='circle' />
                  </button>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div>
              <Label htmlFor='funFact'>Share a fun fact about yourself *</Label>
              <p className='text-muted-foreground mt-1 mb-2 text-sm'>
                Something interesting that even those close to you probably
                don't know about you
              </p>
              <Textarea
                id='funFact'
                value={profileData.funFact || ''}
                onChange={(e) =>
                  setProfileData({ ...profileData, funFact: e.target.value })
                }
                rows={3}
                placeholder='I once...'
                className='resize-none'
              />
            </div>

            {/* Complete Button */}
            <Button
              onClick={handleProfileComplete}
              disabled={!isStep2Complete}
              className='w-full'
            >
              Complete Signup
            </Button>

            {/* Back Button */}
            <Button
              variant='tertiary'
              onClick={() => setSignupStep(1)}
              className='w-full'
            >
              ← Back to email and password
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Auth form (login or signup email/password)
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
                <span className='text-black'>
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
