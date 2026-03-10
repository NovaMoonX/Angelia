import * as admin from 'firebase-admin';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { MulticastMessage } from 'firebase-admin/messaging';

admin.initializeApp();

const db = admin.firestore();
const messaging = admin.messaging();

// ---------------------------------------------------------------------------
// Types (mirrored from the client-side types)
// ---------------------------------------------------------------------------

interface UserDoc {
  id: string;
  firstName: string;
  lastName: string;
  fcmToken?: string | null;
}

interface ChannelDoc {
  id: string;
  name: string;
  ownerId: string;
  subscribers: string[];
}

interface ChannelJoinRequestDoc {
  id: string;
  channelId: string;
  channelOwnerId: string;
  requesterId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
  respondedAt: number | null;
}

interface PostDoc {
  id: string;
  authorId: string;
  channelId: string;
  text: string;
  status: 'uploading' | 'ready' | 'error';
  comments: Array<{ id: string; authorId: string; text: string; timestamp: number }>;
  conversationEnrollees: string[];
}

interface AppNotification {
  id: string;
  recipientId: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  link: string;
  data: {
    channelId: string | null;
    postId: string | null;
    requestId: string | null;
    actorId: string | null;
    actorName: string | null;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Fetch a user document; returns null when not found. */
async function getUser(uid: string): Promise<UserDoc | null> {
  const snap = await db.doc(`users/${uid}`).get();
  if (!snap.exists) return null;
  return { id: uid, ...(snap.data() as Omit<UserDoc, 'id'>) };
}

/** Fetch a channel document; returns null when not found. */
async function getChannel(channelId: string): Promise<ChannelDoc | null> {
  const snap = await db.doc(`channels/${channelId}`).get();
  if (!snap.exists) return null;
  return { id: channelId, ...(snap.data() as Omit<ChannelDoc, 'id'>) };
}

/**
 * Create a notification document in Firestore and, when the recipient has an
 * FCM token, send a push notification to their device.
 */
async function createNotification(
  notificationId: string,
  notification: AppNotification,
  fcmToken: string | null | undefined,
): Promise<void> {
  // Write to Firestore so the in-app notification feed is populated.
  await db.doc(`notifications/${notificationId}`).set(notification);

  if (!fcmToken) return;

  const message: MulticastMessage = {
    tokens: [fcmToken],
    notification: {
      title: notification.title,
      body: notification.body,
    },
    data: {
      notificationId,
      type: notification.type,
      link: notification.link,
      channelId: notification.data.channelId ?? '',
      postId: notification.data.postId ?? '',
      requestId: notification.data.requestId ?? '',
      actorId: notification.data.actorId ?? '',
      actorName: notification.data.actorName ?? '',
    },
    webpush: {
      notification: {
        title: notification.title,
        body: notification.body,
        icon: '/logo.svg',
        badge: '/logo.svg',
      },
      fcmOptions: {
        link: notification.link,
      },
    },
  };

  try {
    const response = await messaging.sendEachForMulticast(message);
    // Remove stale tokens from user documents.
    response.responses.forEach((resp, idx) => {
      if (
        !resp.success &&
        resp.error?.code === 'messaging/registration-token-not-registered'
      ) {
        const token = message.tokens[idx];
        // Attempt to clean up the invalid token.
        db.runTransaction(async (tx) => {
          const usersSnap = await db
            .collection('users')
            .where('fcmToken', '==', token)
            .get();
          usersSnap.docs.forEach((doc) => {
            tx.update(doc.ref, { fcmToken: null });
          });
        }).catch(() => {
          // Best-effort cleanup – ignore errors.
        });
      }
    });
  } catch (error) {
    console.error('[FCM] Failed to send multicast message:', error);
  }
}

/** Generate a unique notification document ID. */
function notificationId(prefix: string, ...parts: string[]): string {
  return [prefix, ...parts].join('_').replace(/[^a-zA-Z0-9_-]/g, '');
}

// ---------------------------------------------------------------------------
// Trigger: new channel join request
// Notify the channel owner that someone wants to join their channel.
// ---------------------------------------------------------------------------

export const onNewJoinRequest = onDocumentCreated(
  'channelJoinRequests/{requestId}',
  async (event) => {
    const request = event.data?.data() as ChannelJoinRequestDoc | undefined;
    if (!request) return;

    const [owner, requester, channel] = await Promise.all([
      getUser(request.channelOwnerId),
      getUser(request.requesterId),
      getChannel(request.channelId),
    ]);

    if (!owner || !requester || !channel) return;

    const requesterName = `${requester.firstName} ${requester.lastName}`.trim();
    const nId = notificationId('jreq', request.id, owner.id);

    await createNotification(
      nId,
      {
        id: nId,
        recipientId: owner.id,
        type: 'channel_request',
        title: 'New channel request',
        body: `${requesterName} wants to join your "${channel.name}" channel.`,
        read: false,
        createdAt: Date.now(),
        link: '/account?view=notifications',
        data: {
          channelId: channel.id,
          postId: null,
          requestId: request.id,
          actorId: requester.id,
          actorName: requesterName,
        },
      },
      owner.fcmToken,
    );
  },
);

// ---------------------------------------------------------------------------
// Trigger: join request accepted
// Notify the requester that they've been accepted into the channel.
// ---------------------------------------------------------------------------

export const onJoinRequestResponse = onDocumentUpdated(
  'channelJoinRequests/{requestId}',
  async (event) => {
    const before = event.data?.before.data() as ChannelJoinRequestDoc | undefined;
    const after = event.data?.after.data() as ChannelJoinRequestDoc | undefined;

    // Only act when the status transitioned to 'accepted'.
    if (!before || !after) return;
    if (before.status === after.status) return;
    if (after.status !== 'accepted') return;

    const [requester, channel] = await Promise.all([
      getUser(after.requesterId),
      getChannel(after.channelId),
    ]);

    if (!requester || !channel) return;

    const nId = notificationId('jres', after.id, requester.id);

    await createNotification(
      nId,
      {
        id: nId,
        recipientId: requester.id,
        type: 'request_accepted',
        title: 'Your request was accepted!',
        body: `You've been added to the "${channel.name}" channel. Welcome!`,
        read: false,
        createdAt: Date.now(),
        link: '/',
        data: {
          channelId: channel.id,
          postId: null,
          requestId: after.id,
          actorId: null,
          actorName: null,
        },
      },
      requester.fcmToken,
    );
  },
);

// ---------------------------------------------------------------------------
// Trigger: new post published
// Notify all channel subscribers (excluding the post author) about the
// new post.  We watch for the status field changing to 'ready' so we only
// fire after all media has been uploaded.
// ---------------------------------------------------------------------------

export const onPostReady = onDocumentUpdated(
  'posts/{postId}',
  async (event) => {
    const before = event.data?.before.data() as PostDoc | undefined;
    const after = event.data?.after.data() as PostDoc | undefined;

    if (!before || !after) return;

    // Handle new post published (status → 'ready').
    if (before.status !== 'ready' && after.status === 'ready') {
      const [author, channel] = await Promise.all([
        getUser(after.authorId),
        getChannel(after.channelId),
      ]);

      if (!author || !channel) return;

      const authorName = `${author.firstName} ${author.lastName}`.trim();
      const recipients = channel.subscribers.filter(
        (uid) => uid !== after.authorId,
      );

      await Promise.all(
        recipients.map(async (uid) => {
          const recipient = await getUser(uid);
          if (!recipient) return;

          const nId = notificationId('post', event.params.postId, uid);
          const preview =
            after.text.length > 80 ? `${after.text.slice(0, 77)}…` : after.text;

          await createNotification(
            nId,
            {
              id: nId,
              recipientId: uid,
              type: 'new_post',
              title: `New post from ${authorName}`,
              body: preview || `${authorName} shared something new in "${channel.name}".`,
              read: false,
              createdAt: Date.now(),
              link: `/posts/${event.params.postId}`,
              data: {
                channelId: channel.id,
                postId: event.params.postId,
                requestId: null,
                actorId: author.id,
                actorName: authorName,
              },
            },
            recipient.fcmToken,
          );
        }),
      );

      return; // Don't fall through to comment handling on the same update.
    }

    // Handle new comment added.
    const oldCount = before.comments?.length ?? 0;
    const newCount = after.comments?.length ?? 0;
    if (newCount <= oldCount) return;

    const newComment = after.comments[newCount - 1];
    if (!newComment) return;

    const [commenter, author] = await Promise.all([
      getUser(newComment.authorId),
      getUser(after.authorId),
    ]);

    if (!commenter) return;

    const commenterName = `${commenter.firstName} ${commenter.lastName}`.trim();
    const commentPreview =
      newComment.text.length > 80
        ? `${newComment.text.slice(0, 77)}…`
        : newComment.text;

    // Notify the post author and all conversation enrollees, but not the
    // person who wrote the comment.
    const recipientSet = new Set<string>();
    if (after.authorId !== newComment.authorId) {
      recipientSet.add(after.authorId);
    }
    after.conversationEnrollees
      .filter((uid) => uid !== newComment.authorId)
      .forEach((uid) => recipientSet.add(uid));

    await Promise.all(
      [...recipientSet].map(async (uid) => {
        const recipient = uid === after.authorId ? author : await getUser(uid);
        if (!recipient) return;

        const nId = notificationId(
          'cmt',
          event.params.postId,
          newComment.id,
          uid,
        );

        await createNotification(
          nId,
          {
            id: nId,
            recipientId: uid,
            type: 'new_comment',
            title: `${commenterName} commented`,
            body: commentPreview,
            read: false,
            createdAt: Date.now(),
            link: `/posts/${event.params.postId}`,
            data: {
              channelId: after.channelId,
              postId: event.params.postId,
              requestId: null,
              actorId: commenter.id,
              actorName: commenterName,
            },
          },
          recipient.fcmToken,
        );
      }),
    );
  },
);
