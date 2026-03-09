import { useAuth } from '@/hooks/useAuth';
import { subscribeToChannels, subscribeToIncomingJoinRequests, subscribeToOutgoingJoinRequests } from '@/lib/channel';
import { subscribeToPosts } from '@/lib/post/post.data';
import { subscribeToCurrentUser } from '@/lib/user/user.data';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useMemo } from 'react';

function DataListenerWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { firebaseUser } = useAuth();
  const channels = useAppSelector((state) => state.channels.items);

  // Subscribe to user profile, channels, and join requests
  useEffect(() => {
    if (!firebaseUser) {
      return;
    }

    const unsubscribeUser = subscribeToCurrentUser(firebaseUser.uid)(dispatch);
    const unsubscribeChannels = subscribeToChannels(firebaseUser.uid)(dispatch);
    const unsubscribeIncomingJoinRequest = subscribeToIncomingJoinRequests(firebaseUser.uid)(dispatch);
    const unsubscribeOutgoingJoinRequest = subscribeToOutgoingJoinRequests(firebaseUser.uid)(dispatch);

    return () => {
      unsubscribeUser();
      unsubscribeChannels();
      unsubscribeIncomingJoinRequest();
      unsubscribeOutgoingJoinRequest();
    };
  }, [firebaseUser, dispatch]);

  // Compute a stable key from sorted channel IDs so the posts subscription
  // only restarts when the set of accessible channels actually changes
  // (not when other channel fields like subscribers are updated).
  const channelIdsKey = useMemo(() => {
    return JSON.stringify(channels.map((ch) => ch.id).sort());
  }, [channels]);

  // Re-subscribe to posts whenever the set of accessible channels changes
  useEffect(() => {
    if (!firebaseUser) {
      return;
    }

    const channelIds: string[] = JSON.parse(channelIdsKey);
    const unsubscribePosts = subscribeToPosts(firebaseUser.uid, channelIds)(dispatch);

    return () => {
      unsubscribePosts();
    };
  }, [firebaseUser, channelIdsKey, dispatch]);

  return <>{children}</>;
}

export default DataListenerWrapper;
