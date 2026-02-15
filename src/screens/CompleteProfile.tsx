import { useState, useEffect } from 'react';
import {
  Avatar,
  Input,
  Label,
  Button,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { type AvatarPreset } from '@lib/app';
import { AVATAR_PRESETS, REDIRECT_PARAM } from '@lib/app/app.constants';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  createUserProfile,
} from '@store/actions/authActions';
import { useAuth } from '@hooks/useAuth';
import { createDailyChannel } from '@/store/actions/channelActions';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  funFact: string;
  avatar: AvatarPreset;
}

export function CompleteProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { firebaseUser, sendVerificationEmail } = useAuth();
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    funFact: '',
    avatar: 'astronaut', // Default avatar
  });

  // Get redirect URL from query params
  const redirectUrl = searchParams.get(REDIRECT_PARAM) || null;

  // Check if profile is already complete and redirect
  useEffect(() => {
    if (currentUser?.accountProgress?.signUpComplete) {
      const timer = setTimeout(() => {
        navigate('/feed');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentUser, navigate]);

  // Show notice if profile already complete
  if (currentUser?.accountProgress?.signUpComplete) {
    return (
      <div className='page flex items-center justify-center p-6'>
        <div className='w-full max-w-md space-y-8'>
          <div className='flex flex-col items-center space-y-4'>
            <Link to='/'>
              <AngeliaLogo className='h-20 w-20 cursor-pointer transition-opacity hover:opacity-80' />
            </Link>
            <h1 className='text-foreground text-3xl font-bold'>
              Profile Already Complete
            </h1>
            <p className='text-foreground/70 text-center'>
              Your profile is already set up. Redirecting you to your feed...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileComplete = async () => {
    setIsLoading(true);

    try {
      if (!firebaseUser) {
        throw new Error('No authenticated user found');
      }

      await dispatch(
        createUserProfile({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          funFact: profileData.funFact,
          avatar: profileData.avatar,
        }),
      );

      await sendVerificationEmail();

      await dispatch(createDailyChannel(firebaseUser.uid));
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/verify-email', { state: { email: firebaseUser.email } });
      }
    } catch (err) {
      console.error('Profile completion error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if form is complete
  const isFormComplete =
    profileData.firstName.trim() !== '' &&
    profileData.lastName.trim() !== '' &&
    profileData.funFact.trim() !== '';

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
                value={profileData.firstName}
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
                value={profileData.lastName}
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
              {AVATAR_PRESETS.map((avatar) => (
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
              Something interesting that even those close to you probably don't
              know about you
            </p>
            <Textarea
              id='funFact'
              value={profileData.funFact}
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
            disabled={!isFormComplete || isLoading}
            className='w-full'
          >
            {isLoading ? 'Creating Account...' : 'Complete Signup'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
