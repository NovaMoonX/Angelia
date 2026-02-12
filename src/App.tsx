import { AuthProvider } from '@contexts/AuthContext';
import { ErrorBoundary } from '@moondreamsdev/dreamer-ui/components';
import { DreamerUIProvider } from '@moondreamsdev/dreamer-ui/providers';
import { router } from '@routes/AppRoutes';
import { store } from '@store/index';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <ErrorBoundary
      fallback={<div className='p-6 text-center'>Something went wrong.</div>}
    >
      <Provider store={store}>
        <AuthProvider>
          <DreamerUIProvider theme={{ defaultTheme: 'light'}}>
            <RouterProvider router={router} />
          </DreamerUIProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
