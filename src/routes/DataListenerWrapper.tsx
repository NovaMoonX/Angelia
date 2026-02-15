import { useAuth } from '@/hooks/useAuth';
import { subscribeToChannels } from '@/lib/channel';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';

function DataListenerWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { firebaseUser } = useAuth();

  useEffect(() => {
    if (!firebaseUser) {
      return;
    }

    const unsubscribe = subscribeToChannels()(dispatch);

    return () => {
      unsubscribe();
    };
  }, [firebaseUser, dispatch]);

  return <>{children}</>;
}

export default DataListenerWrapper;
