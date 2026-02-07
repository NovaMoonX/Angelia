import { ErrorBoundary } from '@moondreamsdev/dreamer-ui/components';
import { RouterProvider } from 'react-router-dom';
import { router } from '@routes/AppRoutes';

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
