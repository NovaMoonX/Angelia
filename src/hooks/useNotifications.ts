import { useEffect } from 'react';
import { useAppDispatch } from '@store/hooks';
import { subscribeToNotifications } from '@lib/notification';
import { markAsRead } from '@store/slices/notificationsSlice';
import { markNotificationRead } from '@lib/notification';

/**
 * Subscribe to real-time notifications for the given user.
 * Call this once the user is authenticated.
 *
 * Returns a function to imperatively mark a single notification as read
 * (updates both Redux state and Firestore).
 */
export function useNotifications(uid: string | null) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = dispatch(subscribeToNotifications(uid));

    return unsubscribe;
  }, [uid, dispatch]);

  const handleMarkAsRead = async (notificationId: string) => {
    dispatch(markAsRead(notificationId));
    await markNotificationRead(notificationId);
  };

  return { markAsRead: handleMarkAsRead };
}
