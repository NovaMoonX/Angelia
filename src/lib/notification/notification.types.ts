export type NotificationType =
  | 'channel_request'
  | 'request_accepted'
  | 'new_post'
  | 'new_comment';

export interface AppNotification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  /** Deep-link the user is taken to when tapping the notification. */
  link: string;
  data: {
    channelId: string | null;
    postId: string | null;
    requestId: string | null;
    actorId: string | null;
    actorName: string | null;
  };
}
