import { REDIRECT_PARAM } from '@lib/app/app.constants';
import { getChannelByInviteCode, mockChannels } from '@lib/channel';
import { getUserById, mockCurrentUser } from '@lib/user';
import {
  Avatar,
  Badge,
  Button,
  Card,
} from '@moondreamsdev/dreamer-ui/components';
import { useToast } from '@moondreamsdev/dreamer-ui/hooks';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export function InviteAccept() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication state - in real app, this would come from auth context
  const [isAuthenticated] = useState(true); // For now, assume user is logged in

  // Find channel by invite code
  const channel = useMemo(() => {
    if (!inviteCode) return null;
    const result = getChannelByInviteCode(inviteCode);

    return result;
  }, [inviteCode]);

  // Get channel owner
  const channelOwner = useMemo(() => {
    if (!channel) return null;
    const result = getUserById(channel.ownerId);

    return result;
  }, [channel]);

  // Check if already subscribed
  const isAlreadySubscribed = useMemo(() => {
    if (!channel) return false;
    const result = channel.subscribers.includes(mockCurrentUser.id);

    return result;
  }, [channel]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleJoinChannel = () => {
    if (!channel) return;

    if (!isAuthenticated) {
      // Redirect to auth with return URL
      navigate(`/auth?${REDIRECT_PARAM}=/invite/${inviteCode}`);
      return;
    }

    if (isAlreadySubscribed) {
      addToast({
        title: 'You are already subscribed to this channel',
        type: 'info',
      });
      navigate('/feed');
      return;
    }

    // Mock join channel - in real app would call API
    const updatedChannel = mockChannels.find((ch) => ch.id === channel.id);
    if (updatedChannel) {
      updatedChannel.subscribers.push(mockCurrentUser.id);
    }

    addToast({
      title: `You've joined ${channel.name}!`,
      type: 'info',
    });
    navigate('/feed');
  };

  const handleDecline = () => {
    navigate('/feed');
  };

  if (isLoading) {
    return (
      <div className='page flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-foreground/60'>Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (!channel) {
    return (
      <div className='page flex items-center justify-center'>
        <div className='w-full max-w-md px-4'>
          <Card className='space-y-6 p-8 text-center'>
            <div className='space-y-2'>
              <h1 className='text-foreground text-2xl font-bold'>
                Invalid Invitation
              </h1>
              <p className='text-foreground/60'>
                This invitation link is invalid or has expired.
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

  return (
    <div className='page flex items-center justify-center'>
      <div className='w-full max-w-md px-4'>
        <Card className='space-y-6 p-8'>
          {/* Header */}
          <div className='space-y-4 pb-4 text-center'>
            {channelOwner && (
              <div className='flex justify-center'>
                <Avatar preset={channelOwner.avatar} size='lg' />
              </div>
            )}
            <div className='space-y-3'>
              <h1 className='text-foreground text-2xl font-bold'>
                You've been invited!
              </h1>
              <p className='text-foreground/70'>
                {channelOwner
                  ? `${channelOwner.firstName} ${channelOwner.lastName} has invited you to join `
                  : 'You have been invited to join '}
                <Badge
                  variant='secondary'
                  className='mx-1 inline-flex px-3 py-1 text-lg font-semibold'
                  style={{ borderColor: channel.color }}
                >
                  {channel.name}
                </Badge>
              </p>
            </div>
          </div>

          {/* Already subscribed message */}
          {isAlreadySubscribed && (
            <div className='bg-muted/20 rounded-lg p-4'>
              <p className='text-foreground/70 text-center text-sm'>
                You are already subscribed to this channel
              </p>
            </div>
          )}

          {/* Actions */}
          <div className='space-y-3'>
            <Button onClick={handleJoinChannel} className='w-full'>
              {isAlreadySubscribed ? 'Go to Channel' : 'Join Channel'}
            </Button>
            <Button
              onClick={handleDecline}
              variant='tertiary'
              className='w-full'
            >
              Decline
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default InviteAccept;
