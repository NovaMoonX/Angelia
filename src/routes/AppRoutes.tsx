import { createBrowserRouter } from 'react-router-dom';

import Home from '@screens/Home';
import Layout from '@ui/Layout';
import Loading from '@ui/Loading';
import ProtectedRoutes from '@components/ProtectedRoutes';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // Auth routes (public)
      {
        path: 'auth',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: Auth } = await import('@screens/Auth');
          return { Component: Auth };
        },
      },
      {
        path: 'verify-email',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: VerifyEmail } = await import('@screens/VerifyEmail');
          return { Component: VerifyEmail };
        },
      },
      // Protected routes
      {
        element: <ProtectedRoutes />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          // About page (lazy loaded)
          {
            path: 'about',
            HydrateFallback: Loading,
            lazy: async () => {
              const { default: About } = await import('@screens/About');
              return { Component: About };
            },
          },
        ],
      },
    ],
  },
]);
