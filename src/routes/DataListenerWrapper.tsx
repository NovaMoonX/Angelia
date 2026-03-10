import { useAuth } from '@/hooks/useAuth';
import { subscribeToChannels, subscribeToIncomingJoinRequests, subscribeToOutgoingJoinRequests } from '@/lib/channel';
import { subscribeToPosts } from '@/lib/post/post.data';
import { subscribeToChannelUsers, subscribeToCurrentUser } from '@/lib/user/user.data';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useMemo } from 'react';

function DataListenerWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { firebaseUser } = useAuth();
  const channels = useAppSelector((state) => state.channels.items);
  const currentUserId = useAppSelector((state) => state.users.currentUser?.id);

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

  // Collect all unique user IDs from accessible channels: owners of channels the
  // current user is subscribed to, plus subscribers of channels the current user
  // owns. Excludes the current user (already tracked by subscribeToCurrentUser).
  const channelUserIds = useMemo(() => {
    if (!currentUserId) return [];
    const userIds = new Set<string>(
      channels.flatMap((ch) => [ch.ownerId, ...ch.subscribers]),
    );
    userIds.delete(currentUserId);
    return Array.from(userIds).sort();
  }, [channels, currentUserId]);

  // Use a stable string key to detect when the actual set of user IDs changes
  const channelUserIdsKey = useMemo(
    () => JSON.stringify(channelUserIds),
    [channelUserIds],
  );

  // Re-subscribe to channel user profiles whenever the set of relevant users changes
  useEffect(() => {
    if (!firebaseUser) {
      return;
    }

    const unsubscribeChannelUsers = subscribeToChannelUsers(channelUserIds)(dispatch);

    return () => {
      unsubscribeChannelUsers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseUser, channelUserIdsKey, dispatch]);

  return <>{children}</>;
}

export default DataListenerWrapper;
