import { useState, useEffect } from 'react';
import { AuthForm, Avatar, type AuthFormOnEmailSubmit } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { useNavigate, useSearchParams } from 'react-router-dom';

type AuthMode = 'login' | 'signup';
type AvatarPreset = 'astronaut' | 'moon' | 'star' | 'galaxy' | 'nebula' | 'planet' | 'cosmic-cat' | 'dream-cloud' | 'rocket' | 'constellation' | 'comet' | 'twilight';

interface ProfileData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: AvatarPreset;
  funFact: string;
}

export function Auth() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get initial mode from query params, default to login
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
  const [profileData, setProfileData] = useState<Partial<ProfileData>>({});
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset>('astronaut');

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

  // Initialize mode from query params
  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup' || modeParam === 'login') {
      setMode(modeParam);
    }
  }, [searchParams]);

  // Update query params when mode changes
  const handleModeChange = (newMode: 'login' | 'sign up') => {
    const authMode: AuthMode = newMode === 'sign up' ? 'signup' : 'login';
    setMode(authMode);
    // Update URL in next tick to avoid React warning
    setTimeout(() => {
      setSearchParams({ mode: authMode });
    }, 0);
    setSignupStep(1); // Reset to step 1 when switching modes
  };

  const handleAuthSubmit: AuthFormOnEmailSubmit = ({ data, action }) => {
    console.log('Auth submitted:', { data, action });

    if (action === 'login') {
      // Mock login - would normally authenticate here
      console.log('Login attempt with:', data.email);
    } else {
      // For signup, save data and move to step 2
      setProfileData({
        email: data.email,
        password: data.password,
      });
      setSignupStep(2);
    }
  };

  const handleProfileComplete = () => {
    const completeProfile: ProfileData = {
      ...profileData as Pick<ProfileData, 'email' | 'password'>,
      firstName: (document.getElementById('firstName') as HTMLInputElement)?.value || '',
      lastName: (document.getElementById('lastName') as HTMLInputElement)?.value || '',
      avatar: selectedAvatar,
      funFact: (document.getElementById('funFact') as HTMLTextAreaElement)?.value || '',
    };

    console.log('Profile complete:', completeProfile);
    
    // Navigate to verify email
    navigate('/verify-email', { state: { email: completeProfile.email } });
  };

  // Step 2: Profile completion
  if (mode === 'signup' && signupStep === 2) {
    return (
      <div className='page flex items-center justify-center p-6'>
        <div className='w-full max-w-md space-y-8'>
          {/* Logo and Title */}
          <div className='flex flex-col items-center space-y-4'>
            <AngeliaLogo className='w-20 h-20' />
            <h1 className='text-3xl font-bold text-foreground'>
              Complete Your Profile
            </h1>
            <p className='text-foreground/70 text-center'>
              Tell us a bit about yourself
            </p>
          </div>

          {/* Profile Form */}
          <div className='space-y-6'>
            {/* Name Fields */}
            <div className='space-y-4'>
              <div>
                <label htmlFor='firstName' className='block text-sm font-medium text-foreground mb-2'>
                  First Name *
                </label>
                <input
                  id='firstName'
                  type='text'
                  required
                  placeholder='John'
                  className={join(
                    'w-full px-4 py-2 rounded-md',
                    'border border-border bg-background',
                    'text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary'
                  )}
                />
              </div>

              <div>
                <label htmlFor='lastName' className='block text-sm font-medium text-foreground mb-2'>
                  Last Name *
                </label>
                <input
                  id='lastName'
                  type='text'
                  required
                  placeholder='Doe'
                  className={join(
                    'w-full px-4 py-2 rounded-md',
                    'border border-border bg-background',
                    'text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary'
                  )}
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className='block text-sm font-medium text-foreground mb-4'>
                Choose Your Avatar *
              </label>
              <div className='grid grid-cols-4 gap-3'>
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar}
                    type='button'
                    onClick={() => setSelectedAvatar(avatar)}
                    className={join(
                      'p-2 rounded-lg transition-all',
                      'hover:bg-accent/20',
                      selectedAvatar === avatar
                        ? 'bg-accent/30 ring-2 ring-accent'
                        : 'bg-muted/20'
                    )}
                  >
                    <Avatar preset={avatar} size='lg' shape='circle' />
                  </button>
                ))}
              </div>
            </div>

            {/* Fun Fact */}
            <div>
              <label htmlFor='funFact' className='block text-sm font-medium text-foreground mb-2'>
                Share a fun fact about yourself *
              </label>
              <p className='text-sm text-muted-foreground mb-2'>
                Something interesting that most people don't know about you
              </p>
              <textarea
                id='funFact'
                required
                rows={3}
                placeholder='I once...'
                className={join(
                  'w-full px-4 py-2 rounded-md',
                  'border border-border bg-background',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-primary',
                  'resize-none'
                )}
              />
            </div>

            {/* Complete Button */}
            <button
              type='button'
              onClick={handleProfileComplete}
              className={join(
                'w-full py-3 px-4 rounded-md',
                'bg-accent hover:bg-accent/90 text-accent-foreground',
                'font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2'
              )}
            >
              Complete Signup
            </button>

            {/* Back Button */}
            <button
              type='button'
              onClick={() => setSignupStep(1)}
              className={join(
                'w-full py-2 text-sm text-foreground/70',
                'hover:text-foreground transition-colors'
              )}
            >
              ← Back to email and password
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Auth form (login or signup email/password)
  return (
    <div className='page flex items-center justify-center p-6'>
      <div className='w-full max-w-md space-y-8'>
        {/* Logo */}
        <div className='flex justify-center'>
          <AngeliaLogo className='w-20 h-20' />
        </div>

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
