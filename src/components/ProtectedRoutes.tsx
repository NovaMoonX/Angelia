import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { REDIRECT_PARAM } from '@lib/app/app.constants';

/**
 * ProtectedRoutes component for protecting routes that require authentication.
 * 
 * When demo mode is NOT active:
 * - Requires user to be authenticated
 * - Requires user to have verified their email
 * - Redirects unauthenticated users to /auth with redirect parameter
 * - Redirects unverified users to /verify-email with redirect parameter
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

  // Build the redirect URL for after authentication
  const currentPath = location.pathname + location.search;
  const redirectUrl = new URLSearchParams();
  redirectUrl.set(REDIRECT_PARAM, currentPath);

  // If no user is authenticated, redirect to auth page with current location as redirect
  if (!currentUser) {
    return <Navigate to={`/auth?${redirectUrl.toString()}`} replace />;
  }

  // If user is authenticated but email is not verified, redirect to verify-email page with redirect
  if (!currentUser.emailVerified) {
    return <Navigate to={`/verify-email?${redirectUrl.toString()}`} replace />;
  }

  // User is authenticated and verified, allow access
  return <Outlet />;
}

export default ProtectedRoutes;
