// Firebase Messaging Service Worker
// Handles background push notifications via Firebase Cloud Messaging.
// The main app thread sends the Firebase config via postMessage so we
// avoid hardcoding credentials in this static file.

importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.0.0/firebase-messaging-compat.js');

let messagingInitialized = false;

// Receive the Firebase config from the main app thread and initialise
// Firebase Messaging.  We guard with `messagingInitialized` so the app
// can safely send the config message multiple times (e.g. on every page
// load) without triggering a duplicate-app error.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'FIREBASE_CONFIG' && !messagingInitialized) {
    messagingInitialized = true;

    firebase.initializeApp(event.data.config);
    const messaging = firebase.messaging();

    // Show a notification for messages received while the app is in the
    // background or the browser tab is closed.
    messaging.onBackgroundMessage((payload) => {
      const title = payload.notification?.title || 'Angelia';
      const options = {
        body: payload.notification?.body || '',
        icon: '/logo.svg',
        badge: '/logo.svg',
        data: payload.data || {},
        // Use a tag so multiple rapid notifications collapse into one
        tag: payload.data?.notificationId || undefined,
      };

      return self.registration.showNotification(title, options);
    });
  }
});

// When the user taps a notification, focus an existing tab or open a new
// one pointing to the relevant deep-link URL.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const link = event.notification.data?.link || '/';

  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ('focus' in client) {
            // Reuse an existing tab if possible and navigate it to the link
            return client.navigate(link).then(() => client.focus());
          }
        }
        // No existing tab – open a new one
        if (clients.openWindow) {
          return clients.openWindow(link);
        }
      }),
  );
});
