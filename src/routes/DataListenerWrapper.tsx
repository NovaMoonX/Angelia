import { useAuth } from '@/hooks/useAuth';
import { subscribeToChannels, subscribeToIncomingJoinRequests, subscribeToOutgoingJoinRequests } from '@/lib/channel';
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
    const unsubscribeIncoming = subscribeToIncomingJoinRequests(firebaseUser.uid)(dispatch);
    const unsubscribeOutgoing = subscribeToOutgoingJoinRequests(firebaseUser.uid)(dispatch);

    return () => {
      unsubscribeUser();
      unsubscribeChannels();
      unsubscribePosts();
      unsubscribeIncoming();
      unsubscribeOutgoing();
    };
  }, [firebaseUser, dispatch]);

  return <>{children}</>;
}

export default DataListenerWrapper;
