import { ErrorBoundary } from '@moondreamsdev/dreamer-ui/components';
import {
  ActionModalProvider,
  ToastProvider,
} from '@moondreamsdev/dreamer-ui/providers';
import { router } from '@routes/AppRoutes';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store/index';
import { AuthProvider } from '@contexts/AuthContext';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <ToastProvider>
            <ActionModalProvider>
              <RouterProvider router={router} />
            </ActionModalProvider>
          </ToastProvider>
        </AuthProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
