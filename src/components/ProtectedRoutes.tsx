import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

/**
 * ProtectedRoutes component for protecting routes that require authentication.
 * Checks if user is authenticated and email is verified.
 * Redirects to auth page if not authenticated, or verify-email if email not verified.
 */
export function ProtectedRoutes() {
  const { currentUser, loading, emailVerified } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className='page flex items-center justify-center'>
        <div className='text-foreground/60'>Loading...</div>
      </div>
    );
  }

  // Redirect to auth page if not authenticated
  if (!currentUser) {
    return (
      <Navigate 
        to={`/auth?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace 
      />
    );
  }

  // Redirect to verify email page if email not verified
  if (!emailVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  return <Outlet />;
}

export default ProtectedRoutes;
