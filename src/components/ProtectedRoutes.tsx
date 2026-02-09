import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';

/**
 * ProtectedRoutes component for protecting routes that require authentication.
 * 
 * When demo mode is NOT active:
 * - Requires user to be authenticated
 * - Requires user to have verified their email
 * - Redirects unauthenticated users to /auth with redirect parameter
 * - Redirects unverified users to /verify-email
 * 
 * When demo mode IS active:
 * - Allows all routes to be accessed (pass-through)
 */
export function ProtectedRoutes() {
  const location = useLocation();
  const isDemoActive = useAppSelector((state) => state.demo.isActive);
  const currentUser = useAppSelector((state) => state.users.currentUser);

  // If demo mode is active, allow access to all routes
  if (isDemoActive) {
    return <Outlet />;
  }

  // If no user is authenticated, redirect to auth page with current location as redirect
  if (!currentUser) {
    const params = new URLSearchParams();
    params.set('redirect', location.pathname + location.search);
    
    const redirectUrl = `/auth?${params.toString()}`;
    
    return <Navigate to={redirectUrl} replace />;
  }

  // If user is authenticated but email is not verified, redirect to verify-email page
  if (!currentUser.emailVerified) {
    return <Navigate to='/verify-email' replace />;
  }

  // User is authenticated and verified, allow access
  return <Outlet />;
}

export default ProtectedRoutes;
