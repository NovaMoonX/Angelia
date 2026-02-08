import { createBrowserRouter } from 'react-router-dom';

import Home from '@screens/Home';
import Layout from '@ui/Layout';
import Loading from '@ui/Loading';

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
