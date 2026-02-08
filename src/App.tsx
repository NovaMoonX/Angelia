import { ErrorBoundary } from '@moondreamsdev/dreamer-ui/components';
import {
  ActionModalProvider,
  ToastProvider,
} from '@moondreamsdev/dreamer-ui/providers';
import { router } from '@routes/AppRoutes';
import { RouterProvider } from 'react-router-dom';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ActionModalProvider>
          <RouterProvider router={router} />
        </ActionModalProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
