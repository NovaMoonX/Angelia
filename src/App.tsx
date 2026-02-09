import { ErrorBoundary } from '@moondreamsdev/dreamer-ui/components';
import {
  ActionModalProvider,
  ToastProvider,
} from '@moondreamsdev/dreamer-ui/providers';
import { router } from '@routes/AppRoutes';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@store/index';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <ToastProvider>
          <ActionModalProvider>
            <RouterProvider router={router} />
          </ActionModalProvider>
        </ToastProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
