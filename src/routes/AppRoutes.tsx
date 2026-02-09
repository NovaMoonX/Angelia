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
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: About } = await import('@screens/About');
          return { Component: About };
        },
      },
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
      // Demo routes - publicly accessible
      {
        path: 'demo',
        children: [
          {
            path: 'feed',
            HydrateFallback: Loading,
            lazy: async () => {
              const { default: DemoFeed } = await import('@screens/Demo/DemoFeed');
              return { Component: DemoFeed };
            },
          },
          {
            path: 'tiding/:id',
            HydrateFallback: Loading,
            lazy: async () => {
              const { default: DemoPostDetail } = await import('@screens/Demo/DemoPostDetail');
              return { Component: DemoPostDetail };
            },
          },
          {
            path: 'account',
            HydrateFallback: Loading,
            lazy: async () => {
              const { default: DemoAccount } = await import('@screens/Demo/DemoAccount');
              return { Component: DemoAccount };
            },
          },
        ],
      },
      // Protected routes - require authentication and email verification
      {
        element: <ProtectedRoutes />,
        children: [
          {
            path: 'feed',
            HydrateFallback: Loading,
            lazy: async () => {
              const { default: Feed } = await import('@screens/Feed');
              return { Component: Feed };
            },
          },
          {
            path: 'tiding/:id',
            HydrateFallback: Loading,
            lazy: async () => {
              const { default: PostDetail } = await import('@screens/PostDetail');
              return { Component: PostDetail };
            },
          },
          {
            path: 'account',
            HydrateFallback: Loading,
            lazy: async () => {
              const { default: Account } = await import('@screens/Account');
              return { Component: Account };
            },
          },
        ],
      },
      {
        path: 'invite/:inviteCode',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: InviteAccept } = await import('@screens/InviteAccept');
          return { Component: InviteAccept };
        },
      },
      {
        path: '*',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: NotFound } = await import('@screens/NotFound');
          return { Component: NotFound };
        },
      },
    ],
  },
]);
