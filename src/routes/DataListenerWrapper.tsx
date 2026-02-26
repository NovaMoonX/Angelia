import { useAuth } from '@/hooks/useAuth';
import { subscribeToChannels } from '@/lib/channel';
import { subscribeToCurrentUser } from '@/lib/user/user.data';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';

function DataListenerWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { firebaseUser } = useAuth();

  useEffect(() => {
    if (!firebaseUser) {
      return;
    }

    const unsubscribeChannels = subscribeToChannels()(dispatch);
    const unsubscribeUser = subscribeToCurrentUser(firebaseUser.uid)(dispatch);

    return () => {
      unsubscribeChannels();
      unsubscribeUser();
    };
  }, [firebaseUser, dispatch]);

  return <>{children}</>;
}

export default DataListenerWrapper;
