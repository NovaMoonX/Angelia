import { useAuth } from '@/hooks/useAuth';
import { subscribeToChannels } from '@/lib/channel';
import { subscribeToPosts } from '@/lib/post/post.data';
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

    const unsubscribeUser = subscribeToCurrentUser(firebaseUser.uid)(dispatch);
    const unsubscribeChannels = subscribeToChannels()(dispatch);
    const unsubscribePosts = subscribeToPosts()(dispatch);

    return () => {
      unsubscribeUser();
      unsubscribeChannels();
      unsubscribePosts();
    };
  }, [firebaseUser, dispatch]);

  return <>{children}</>;
}

export default DataListenerWrapper;
