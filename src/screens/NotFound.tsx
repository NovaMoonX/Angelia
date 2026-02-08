import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/', { replace: true });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Page not found
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Redirecting you home...
        </p>
      </div>
    </div>
  );
}
