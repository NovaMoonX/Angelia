import { User } from '@/lib/user';
import { fetchUserById } from '@/lib/user/user.data';
import { useAuth } from '@hooks/useAuth';
import { fetchChannelById } from '@lib/channel/channel.data';
import { Channel } from '@lib/channel/channel.types';
import { getRelativeTime } from '@lib/timeUtils';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { useToast } from '@moondreamsdev/dreamer-ui/hooks';
import { createJoinRequest } from '@store/actions/channelActions';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function InviteAccept() {
  const { channelId, inviteCode } = useParams<{
    channelId: string;
    inviteCode: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const { firebaseUser } = useAuth();

  const currentUser = useAppSelector((state) => state.users.currentUser);
  const outgoingRequests = useAppSelector((state) => state.invites.outgoing);

  const [channel, setChannel] = useState<Channel | null | undefined>(undefined); // undefined = loading
  const [channelOwner, setChannelOwner] = useState<User | null | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch channel info from Firestore
  useEffect(() => {
    if (!channelId) {
      setChannel(null);
      return;
    }
    fetchChannelById(channelId).then((ch) => {
      setChannel(ch ?? null);
    });
  }, [channelId]);

  // Fetch channel owner info from Firestore
  useEffect(() => {
    if (!channel || !channel.ownerId) {
      setChannelOwner(null);
      return;
    }
    fetchUserById(channel.ownerId).then((user) => {
      setChannelOwner(user ?? null);
    });
  }, [channel]);

  const isValidInvite = useMemo(() => {
    if (!channel || !inviteCode) return false;
    const result = channel.inviteCode === inviteCode;
    return result;
  }, [channel, inviteCode]);

  const isChannelOwner = useMemo(() => {
    if (!channel || !currentUser) return false;
    const result = channel.ownerId === currentUser.id;
    return result;
  }, [channel, currentUser]);

  const isAlreadySubscribed = useMemo(() => {
    if (!channel || !currentUser) return false;
    const result = channel.subscribers.includes(currentUser.id);
    return result;
  }, [channel, currentUser]);

  const existingRequest = useMemo(() => {
    if (!channelId) return null;
    const result =
      outgoingRequests.find((r) => r.channelId === channelId) ?? null;
    return result;
  }, [outgoingRequests, channelId]);

  const ownerDisplayName = useMemo(() => {
    if (!channel || !channelOwner) return 'the channel owner';
    return channelOwner.firstName || channelOwner.email || 'the channel owner';
  }, [channel, channelOwner]);

  const handleSubmit = async () => {
    if (!channelId || !inviteCode || !message.trim()) return;
    setIsSubmitting(true);
    try {
      await dispatch(
        createJoinRequest({ channelId, inviteCode, message: message.trim() }),
      ).unwrap();
      addToast({
        title: 'Request sent! The owner will review it shortly.',
        type: 'success',
      });
      navigate('/feed');
    } catch (err) {
      addToast({
        title:
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!firebaseUser) return null;

  if (channel === undefined) {
    return (
      <div className='page flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-foreground/60'>Loading invitation...</p>
        </div>
      </div>
    );
  }

  // Invalid link
  if (!channel || !isValidInvite) {
    return (
      <div className='page flex items-center justify-center'>
        <div className='w-full max-w-md px-4'>
          <Card className='space-y-6 p-8 text-center'>
            <div className='space-y-2'>
              <h1 className='text-foreground text-2xl font-bold'>
                Invalid Invite Link
              </h1>
              <p className='text-foreground/60'>
                This invite link is invalid or has expired. Ask the channel
                owner to share a new one.
              </p>
            </div>
            <Button onClick={() => navigate('/feed')} className='w-full'>
              Go to Feed
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (isChannelOwner) {
    return (
      <div className='page flex items-center justify-center'>
        <div className='w-full max-w-md px-4'>
          <Card className='space-y-6 p-8 text-center'>
            <div className='space-y-2 pb-4'>
              <h1 className='text-foreground text-2xl font-bold'>
                Hey, that's your channel!
              </h1>
              <p className='text-foreground/60'>
                Looks like you're the owner of{' '}
                <span className='font-semibold'>{channel.name}</span>. You
                don't need to accept your own invite!
              </p>
            </div>
            <div className='space-y-2'>
            <Button onClick={() => navigate('/account?tab=my-channels')} className='w-full'>
              View all channels
            </Button>
            <Button variant='link' onClick={() => navigate('/feed')} className='w-full'>
              Head back to Feed
            </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (isAlreadySubscribed) {
    return (
      <div className='page flex items-center justify-center'>
        <div className='w-full max-w-md px-4'>
          <Card className='space-y-6 p-8 text-center'>
            <div className='space-y-2'>
              <h1 className='text-foreground text-2xl font-bold'>
                {"You're already in!"}
              </h1>
              <p className='text-foreground/60'>
                {"You're already subscribed to"}{' '}
                <span className='font-semibold'>{channel.name}</span>.
              </p>
            </div>
            <Button onClick={() => navigate('/feed')} className='w-full'>
              Go to Feed
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (existingRequest) {
    const statusLabel =
      existingRequest.status === 'pending'
        ? 'Your request is waiting for the owner to review it.'
        : existingRequest.status === 'accepted'
          ? 'Your request was accepted! You should have access now.'
          : 'Your request was declined by the owner.';

    return (
      <div className='page flex items-center justify-center'>
        <div className='w-full max-w-md px-4'>
          <Card className='space-y-6 p-8 text-center'>
            <div className='space-y-2'>
              <h1 className='text-foreground text-2xl font-bold'>
                {existingRequest.status === 'accepted'
                  ? "You're in!"
                  : 'Request already sent'}
              </h1>
              <p className='text-foreground/60'>{statusLabel}</p>
              {existingRequest.createdAt && (
                <p className='text-foreground/40 text-xs'>
                  Sent {getRelativeTime(existingRequest.createdAt)}
                </p>
              )}
            </div>
            <Button onClick={() => navigate('/feed')} className='w-full'>
              Go to Feed
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='page flex items-center justify-center'>
      <div className='w-full max-w-md px-4'>
        <Card className='space-y-6 p-8'>
          <div className='space-y-4 pb-2 text-center'>
            {currentUser && (
              <div className='flex justify-center'>
                <Avatar preset={currentUser.avatar} size='lg' />
              </div>
            )}
            <div className='space-y-3'>
              <h1 className='text-foreground text-2xl font-bold'>
                You've been invited!
              </h1>
              <p className='text-foreground/70'>
                You have been invited to join{' '}
                <Badge
                  variant='secondary'
                  className='mx-1 inline-flex px-3 py-1 text-base font-semibold'
                  style={{ borderColor: 'currentColor' }}
                >
                  {channel.name}
                </Badge>
                <br />
                by {ownerDisplayName}.
              </p>
              {!channel.isDaily && channel.description && (
                <p className='text-foreground/50 text-sm'>
                  {channel.description}
                </p>
              )}
            </div>
          </div>

          {/* Identification prompt */}
          <div className='space-y-3 pt-4'>
            <div className='space-y-1'>
              <p className='text-foreground font-medium'>
                Hey, how should {ownerDisplayName} know it's really you? 👀
              </p>
              <p className='text-foreground/50 text-sm'>
                Share something that helps them recognize you — an inside joke,
                where you met, or anything fun!
              </p>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='e.g. "It&apos;s me, Alex! We met at the hiking trip last summer 🏔️"'
              rows={4}
              maxLength={300}
            />
          </div>

          {/* Actions */}
          <div className='space-y-3'>
            <Button
              onClick={handleSubmit}
              className='w-full'
              disabled={!message.trim() || isSubmitting}
            >
              {isSubmitting ? 'Sending request...' : 'Request to Join'}
            </Button>
            <Button
              onClick={() => navigate('/feed')}
              variant='tertiary'
              className='w-full'
            >
              Maybe later
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default InviteAccept;
