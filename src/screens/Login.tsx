import { useState } from 'react';
import { Button, Form, FormFactories } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { AngeliaLogo } from '@components/AngeliaLogo';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

export function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const fields = [
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

  const handleSubmit = (data: LoginFormData) => {
    console.log('Form submitted:', data);
    
    // For sign up, navigate to verify email page
    if (isSignUp) {
      navigate('/verify-email', { state: { email: data.email } });
    } else {
      // For sign in, would normally authenticate and redirect
      // For now, just log
      console.log('Sign in attempt with:', data.email);
    }
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
        <Form<LoginFormData>
          form={fields}
          onSubmit={handleSubmit}
          className='space-y-6'
          submitButton={
            <Button
              type='submit'
              className={join(
                'w-full',
                'bg-accent hover:bg-accent/90 text-accent-foreground'
              )}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          }
        />

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
