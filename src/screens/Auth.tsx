import { useState, useEffect } from 'react';
import { AuthForm, Avatar, Input, Label, Button, Textarea, type AuthFormOnEmailSubmit } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

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
  
  // Form state for step 2
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarPreset>('astronaut');
  const [funFact, setFunFact] = useState('');

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

  // Initialize mode from query params - this ensures the AuthForm shows the right mode initially
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
      firstName,
      lastName,
      avatar: selectedAvatar,
      funFact,
    };

    console.log('Profile complete:', completeProfile);
    
    // Navigate to verify email
    navigate('/verify-email', { state: { email: completeProfile.email } });
  };

  // Check if step 2 form is complete
  const isStep2Complete = firstName.trim() !== '' && lastName.trim() !== '' && funFact.trim() !== '';

  // Step 2: Profile completion
  if (mode === 'signup' && signupStep === 2) {
    return (
      <div className='page flex items-center justify-center p-6'>
        <div className='w-full max-w-md space-y-8'>
          {/* Logo and Title */}
          <div className='flex flex-col items-center space-y-4'>
            <Link to='/'>
              <AngeliaLogo className='w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity' />
            </Link>
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
                <Label htmlFor='firstName'>First Name *</Label>
                <Input
                  id='firstName'
                  type='text'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder='John'
                  className='mt-2'
                />
              </div>

              <div>
                <Label htmlFor='lastName'>Last Name *</Label>
                <Input
                  id='lastName'
                  type='text'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder='Doe'
                  className='mt-2'
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <Label>Choose Your Avatar *</Label>
              <div className='grid grid-cols-4 gap-3 mt-4'>
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
              <Label htmlFor='funFact'>Share a fun fact about yourself *</Label>
              <p className='text-sm text-muted-foreground mt-1 mb-2'>
                Something interesting that even those close to you probably don't know about you
              </p>
              <Textarea
                id='funFact'
                value={funFact}
                onChange={(e) => setFunFact(e.target.value)}
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
        {/* Logo */}
        <div className='flex justify-center'>
          <Link to='/'>
            <AngeliaLogo className='w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity' />
          </Link>
        </div>

        {/* AuthForm */}
        <AuthForm
          methods={['email']}
          action={mode === 'signup' ? 'sign up' : 'login'}
          onActionChange={handleModeChange}
          onEmailSubmit={handleAuthSubmit}
          className='space-y-6'
        />
      </div>
    </div>
  );
}

export default Auth;
