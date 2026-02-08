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
      // Feed page (lazy loaded)
      {
        path: 'feed',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: Feed } = await import('@screens/Feed');
          return { Component: Feed };
        },
      },
      // Account page (lazy loaded)
      {
        path: 'account',
        HydrateFallback: Loading,
        lazy: async () => {
          const { default: Account } = await import('@screens/Account');
          return { Component: Account };
        },
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
]);
