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
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { auth } from '@lib/firebase';
import { useToast } from '@moondreamsdev/dreamer-ui/hooks';

type AuthMode = 'login' | 'signup';

interface ProfileData extends Omit<User, 'id' | 'joinedAt'> {
  password: string;
}

export function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  // Get initial mode from query params, default to login
  const authMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  // Get redirect URL from query params
  const redirectUrl = searchParams.get('redirect') || null;
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({
    avatar: 'astronaut', // Default avatar
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      params.redirect = redirectUrl;
    }
    
    setSearchParams(params);
    // Update URL in next tick to avoid React warning
    setTimeout(() => {
      setSearchParams(params);
    }, 0);
    setSignupStep(1); // Reset to step 1 when switching modes
  };

  const handleAuthSubmit: AuthFormOnEmailSubmit = async ({ data, action }) => {
    setIsLoading(true);
    setError(null);

    try {
      if (action === 'login') {
        // Sign in with Firebase
        await signInWithEmailAndPassword(auth, data.email, data.password);
        
        // After successful login, redirect to the specified URL or default to feed
        navigate(redirectUrl || '/feed');
        return {};
      } else {
        // For signup, save data and move to step 2
        setProfileData({
          ...profileData,
          email: data.email,
          password: data.password,
        });
        setSignupStep(2);
        return {};
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      
      const errorMessage = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.code === 'auth/user-not-found'
        ? 'No account found with this email'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : err.code === 'auth/too-many-requests'
        ? 'Too many failed attempts. Please try again later.'
        : 'An error occurred. Please try again.';
      
      setError(errorMessage);
      toast.addToast({
        title: 'Authentication Error',
        description: errorMessage,
        type: 'error',
      });
      
      return { error: { message: errorMessage } };
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileComplete = async () => {
    if (!profileData.email || !profileData.password) {
      toast.addToast({
        title: 'Error',
        description: 'Missing email or password',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        profileData.email,
        profileData.password
      );

      // Update profile with display name
      await updateProfile(userCredential.user, {
        displayName: `${profileData.firstName} ${profileData.lastName}`,
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);

      toast.addToast({
        title: 'Account Created!',
        description: 'Please check your email to verify your account.',
        type: 'success',
      });

      // Navigate to verify email page
      navigate('/verify-email', { state: { email: profileData.email } });
    } catch (err: any) {
      console.error('Signup error:', err);
      
      const errorMessage = err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : err.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : 'Failed to create account. Please try again.';
      
      setError(errorMessage);
      toast.addToast({
        title: 'Signup Error',
        description: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
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

            {/* Error Callout */}
            {error && (
              <Callout
                variant='destructive'
                description={error}
                dismissible
                onDismiss={() => setError(null)}
              />
            )}

            {/* Complete Button */}
            <Button
              onClick={handleProfileComplete}
              disabled={!isStep2Complete || isLoading}
              className='w-full'
            >
              {isLoading ? 'Creating Account...' : 'Complete Signup'}
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
                  to='/demo/feed'
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

        {/* Error Callout */}
        {error && (
          <Callout
            variant='destructive'
            description={error}
            dismissible
            onDismiss={() => setError(null)}
          />
        )}

        {/* AuthForm */}
        <AuthForm
          methods={['email']}
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
