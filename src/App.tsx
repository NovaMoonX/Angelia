import { ErrorBoundary } from '@moondreamsdev/dreamer-ui/components';
import {
  ActionModalProvider,
  ToastProvider,
} from '@moondreamsdev/dreamer-ui/providers';
import { router } from '@routes/AppRoutes';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@contexts/AuthProvider';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <ActionModalProvider>
            <RouterProvider router={router} />
          </ActionModalProvider>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
