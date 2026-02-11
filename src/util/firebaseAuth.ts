/**
 * Maps Firebase Auth error codes to user-friendly error messages.
 * Provides clear, actionable guidance for common authentication errors.
 */
export const formatAuthErrorCode = (code: string): string => {
  switch (code) {
    // Email/Password Sign-in Errors
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    
    // Sign-up Errors
    case 'auth/email-already-in-use':
    case 'auth/email-already-exists':
      return 'An account with this email already exists. Try signing in instead.';
    case 'auth/weak-password':
    case 'auth/invalid-password':
      return 'Password must be at least 6 characters.';
    
    // Token/Session Errors
    case 'auth/id-token-expired':
    case 'auth/session-cookie-expired':
      return 'Your session has expired. Please sign in again.';
    case 'auth/id-token-revoked':
    case 'auth/session-cookie-revoked':
      return 'Your session has been revoked. Please sign in again.';
    
    // Rate Limiting
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    
    // Configuration/Permission Errors
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please use a different method.';
    case 'auth/insufficient-permission':
      return 'You don\'t have permission to perform this action.';
    
    // OAuth/Provider Errors
    case 'auth/invalid-credential':
      return 'Invalid credentials. Please try signing in again.';
    case 'auth/unauthorized-continue-uri':
      return 'The redirect URL is not authorized.';
    case 'auth/invalid-continue-uri':
      return 'Invalid redirect URL.';
    
    // Phone Number Errors
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number.';
    case 'auth/phone-number-already-exists':
      return 'This phone number is already in use.';
    
    // Verification Errors
    case 'auth/invalid-email-verified':
      return 'Email verification status is invalid.';
    
    // User Management Errors
    case 'auth/invalid-display-name':
      return 'Display name cannot be empty.';
    case 'auth/invalid-photo-url':
      return 'Profile photo URL is invalid.';
    case 'auth/invalid-uid':
      return 'User ID is invalid.';
    case 'auth/uid-already-exists':
      return 'This user ID is already in use.';
    
    // General Errors
    case 'auth/internal-error':
      return 'An unexpected error occurred. Please try again.';
    case 'auth/invalid-argument':
      return 'Invalid request. Please check your information and try again.';
    case 'auth/project-not-found':
      return 'Configuration error. Please contact support.';
    
    // Default fallback
    default:
      return 'An error occurred during authentication. Please try again.';
  }
};

/**
 * Type guard to check if an error is a Firebase Auth error
 */
export const isFirebaseError = (error: unknown): error is { code: string; message: string } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    (error as { code: string }).code.startsWith('auth/')
  );
};

/**
 * Gets a user-friendly error message from a Firebase error or generic error
 */
export const getAuthErrorMessage = (error: unknown): string => {
  if (isFirebaseError(error)) {
    return formatAuthErrorCode(error.code);
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
};

