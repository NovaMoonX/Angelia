import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@store/hooks';
import { REDIRECT_PARAM } from '@lib/app/app.constants';
import { useAuth } from '@hooks/useAuth';
import Loading from '@ui/Loading';
import { useMemo } from 'react';

/**
 * ProtectedRoutes component for protecting routes that require authentication.
 *
 * When demo mode is NOT active:
 * - Requires user to be authenticated via Firebase
 * - Requires user to have verified their email
 * - Requires user to have completed signup (signUpComplete: true)
 * - Redirects unauthenticated users to /auth with redirect parameter
 * - Redirects unverified users to /verify-email with redirect parameter
 * - Redirects incomplete signups to /complete-profile to finish profile setup
 *
 * When demo mode IS active:
 * - Allows all routes to be accessed (pass-through)
 */
export function ProtectedRoutes() {
  const location = useLocation();
  const isDemoActive = useAppSelector((state) => state.demo.isActive);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const { firebaseUser, loading } = useAuth();

  // Build the redirect URL for after authentication
  const redirectUrl = useMemo(() => {
    const currentPath = location.pathname + location.search;
    const params = new URLSearchParams();
    params.set(REDIRECT_PARAM, currentPath);

    return params.toString();
  }, [location.pathname, location.search]);

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
    return <Navigate to={`/auth?${redirectUrl}`} replace />;
  }

  // If user hasn't completed signup (profile), redirect to complete-profile
  if (!currentUser || !currentUser?.accountProgress?.signUpComplete) {
    return <Navigate to='/complete-profile' replace />;
  }

  // If user is authenticated but email is not verified, redirect to verify-email page with redirect
  if (!firebaseUser.emailVerified) {
    return <Navigate to={`/verify-email?${redirectUrl}`} replace />;
  }

  // User is authenticated and verified, allow access
  return <Outlet />;
}

export default ProtectedRoutes;
