import { Outlet } from 'react-router-dom';

/**
 * ProtectedRoutes component for protecting routes that require authentication.
 * Currently allows all routes to be accessed (pass-through).
 * TODO: Implement actual authentication check when auth system is ready.
 */
export function ProtectedRoutes() {
  // TODO: Add authentication check here
  // const isAuthenticated = useAuth(); // or similar
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }

  return <Outlet />;
}

export default ProtectedRoutes;
