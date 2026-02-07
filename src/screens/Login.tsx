import { useState, useEffect } from 'react';
import { Button, Form, FormFactories } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface SignInFormData {
  email: string;
  password: string;
}

interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export function Login() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Check for mode query parameter on mount
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsSignUp(true);
    }
  }, [searchParams]);

  const signInFields = [
    FormFactories.input({
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'you@example.com',
    }),
    FormFactories.input({
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: '••••••••',
    }),
  ];

  const signUpFields = [
    FormFactories.input({
      name: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'John',
    }),
    FormFactories.input({
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Doe',
    }),
    FormFactories.input({
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'you@example.com',
    }),
    FormFactories.input({
      name: 'phoneNumber',
      label: 'Phone Number (Optional)',
      type: 'tel',
      required: false,
      placeholder: '+1 (555) 000-0000',
      description: 'Opt in to receive SMS notifications (coming soon)',
    }),
    FormFactories.input({
      name: 'password',
      label: 'Password',
      type: 'password',
      required: true,
      placeholder: '••••••••',
    }),
  ];

  const handleSignInSubmit = (data: SignInFormData) => {
    console.log('Sign in attempt:', data);
    // For sign in, would normally authenticate and redirect
    // For now, just log
  };

  const handleSignUpSubmit = (data: SignUpFormData) => {
    console.log('Account created:', data);
    // Navigate to verify email page with user's email
    navigate('/verify-email', { state: { email: data.email } });
  };

  return (
    <div className='page flex items-center justify-center p-6'>
      <div className='w-full max-w-md space-y-8'>
        {/* Logo and Title */}
        <div className='flex flex-col items-center space-y-4'>
          <AngeliaLogo className='w-20 h-20' />
          <h1 className='text-3xl font-bold text-foreground'>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </h1>
          <p className='text-foreground/70 text-center'>
            {isSignUp
              ? 'Join Angelia to connect with your family'
              : 'Welcome back to Angelia'}
          </p>
        </div>

        {/* Form */}
        {isSignUp ? (
          <Form<SignUpFormData>
            form={signUpFields}
            onSubmit={handleSignUpSubmit}
            className='space-y-6'
            submitButton={
              <Button
                type='submit'
                className={join(
                  'w-full',
                  'bg-accent hover:bg-accent/90 text-accent-foreground'
                )}
              >
                Create Account
              </Button>
            }
          />
        ) : (
          <Form<SignInFormData>
            form={signInFields}
            onSubmit={handleSignInSubmit}
            className='space-y-6'
            submitButton={
              <Button
                type='submit'
                className={join(
                  'w-full',
                  'bg-accent hover:bg-accent/90 text-accent-foreground'
                )}
              >
                Sign In
              </Button>
            }
          />
        )}

        {/* Toggle Sign In/Sign Up */}
        <div className='text-center space-y-4'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-border' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-background text-foreground/60'>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
            </div>
          </div>

          <Button
            variant='tertiary'
            onClick={() => setIsSignUp(!isSignUp)}
            className='w-full'
          >
            {isSignUp ? 'Sign In' : 'Create Account'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
