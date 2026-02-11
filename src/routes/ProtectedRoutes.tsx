import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { REDIRECT_PARAM } from '@lib/app/app.constants';
import { useAuth } from '@hooks/useAuth';
import Loading from '@ui/Loading';

/**
 * ProtectedRoutes component for protecting routes that require authentication.
 * 
 * When demo mode is NOT active:
 * - Requires user to be authenticated via Firebase
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
  const { firebaseUser, loading } = useAuth();

  // Build the redirect URL for after authentication
  const currentPath = location.pathname + location.search;
  const redirectUrl = new URLSearchParams();
  redirectUrl.set(REDIRECT_PARAM, currentPath);

  // If demo mode is active, allow access to all routes
  if (isDemoActive) {
    return <Outlet />;
  }

  // Show loading state while checking auth
  if (loading) {
    return <Loading />;
  }

  // If no user is authenticated, redirect to auth page with current location as redirect
  if (!firebaseUser) {
    return <Navigate to={`/auth?${redirectUrl.toString()}`} replace />;
  }

  // If user is authenticated but email is not verified, redirect to verify-email page with redirect
  if (!firebaseUser.emailVerified) {
    return <Navigate to={`/verify-email?${redirectUrl.toString()}`} replace />;
  }

  // User is authenticated and verified, allow access
  return <Outlet />;
}

export default ProtectedRoutes;
