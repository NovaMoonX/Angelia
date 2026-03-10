import { AppDispatch } from '@/store';
import { setNotifications } from '@/store/slices/notificationsSlice';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase';
import { AppNotification } from './notification.types';

/**
 * Subscribe to the current user's notifications in real-time.
 * Returns an unsubscribe function for cleanup.
 */
export const subscribeToNotifications =
  (uid: string) =>
  (dispatch: AppDispatch): (() => void) => {
    const q = query(
      collection(db, 'notifications'),
      where('recipientId', '==', uid),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() } as AppNotification),
      );
      dispatch(setNotifications(notifications));
    });

    return unsubscribe;
  };

/**
 * Mark a single notification as read in Firestore.
 */
export const markNotificationRead = async (
  notificationId: string,
): Promise<void> => {
  const ref = doc(db, 'notifications', notificationId);
  await updateDoc(ref, { read: true });
};

/**
 * Mark all of a user's notifications as read in Firestore.
 * Note: This performs one write per unread notification; for large numbers
 * of notifications a batch write would be more efficient.
 */
export const markAllNotificationsRead = async (
  notifications: AppNotification[],
): Promise<void> => {
  const unread = notifications.filter((n) => !n.read);
  await Promise.all(unread.map((n) => markNotificationRead(n.id)));
};
