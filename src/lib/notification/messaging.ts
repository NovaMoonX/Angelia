import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { doc, updateDoc } from 'firebase/firestore';
import { app, db } from '../firebase';

// The VAPID key (Web Push certificate public key) for the Firebase project.
// Generate this in the Firebase console → Project Settings → Cloud Messaging →
// Web Push certificates.
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

/**
 * Register the Firebase Messaging service worker and send it the Firebase
 * config so it can initialise itself without hardcoded credentials.
 *
 * Returns the ServiceWorkerRegistration, or null if the browser does not
 * support push or service workers.
 */
export async function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(
      '/firebase-messaging-sw.js',
      { scope: '/' },
    );

    // Build the config object that the SW needs to initialise Firebase.
    const config = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    // Helper: post config to a specific ServiceWorker instance.
    const sendConfig = (sw: ServiceWorker) => {
      sw.postMessage({ type: 'FIREBASE_CONFIG', config });
    };

    // If the SW is already active (e.g. a page refresh), send immediately.
    if (registration.active) {
      sendConfig(registration.active);
    }

    // Also handle newly installing / waiting SWs so the config is delivered
    // as soon as the SW becomes active.
    const pending = registration.installing ?? registration.waiting;
    if (pending) {
      pending.addEventListener('statechange', function () {
        if (this.state === 'activated') {
          sendConfig(this as ServiceWorker);
        }
      });
    }

    // Re-send config whenever a new SW takes control (e.g. after an update).
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (navigator.serviceWorker.controller) {
        sendConfig(navigator.serviceWorker.controller);
      }
    });

    return registration;
  } catch (error) {
    console.error('[Messaging] Service worker registration failed:', error);
    return null;
  }
}

/**
 * Request notification permission, obtain the FCM registration token, save it
 * to the user's Firestore document, and return the token.
 *
 * Returns null if permission is denied, the browser is unsupported, or the
 * VAPID key has not been configured.
 */
export async function requestAndSaveFcmToken(
  uid: string,
  swRegistration: ServiceWorkerRegistration,
): Promise<string | null> {
  if (!VAPID_KEY) {
    console.warn(
      '[Messaging] VITE_FIREBASE_VAPID_KEY is not set – push notifications will not work.',
    );
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      return null;
    }

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: swRegistration,
    });

    if (token) {
      // Persist the token so Cloud Functions can send push notifications to
      // this device.
      await updateDoc(doc(db, 'users', uid), { fcmToken: token });
    }

    return token ?? null;
  } catch (error) {
    console.error('[Messaging] Failed to get FCM token:', error);
    return null;
  }
}

/**
 * Subscribe to foreground FCM messages.
 * Foreground messages are delivered while the app tab is open and focused;
 * background messages are handled by the service worker instead.
 *
 * Returns an unsubscribe function.
 */
export function onForegroundMessage(
  callback: (payload: { notification?: { title?: string; body?: string }; data?: Record<string, string> }) => void,
): () => void {
  try {
    const messaging = getMessaging(app);
    return onMessage(messaging, callback);
  } catch {
    // Firebase Messaging is not supported in this environment (e.g. SSR).
    return () => {};
  }
}
