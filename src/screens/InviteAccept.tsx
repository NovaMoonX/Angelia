import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Avatar, Badge } from '@moondreamsdev/dreamer-ui/components';
import { useToast } from '@moondreamsdev/dreamer-ui/hooks';
import {
  getChannelByInviteCode,
  getUserById,
  mockCurrentUser,
  mockChannels,
} from '@lib/mockData';

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
      navigate(`/auth?redirect=/invite/${inviteCode}`);
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
          <Card className='p-8 space-y-6 text-center'>
            <div className='space-y-2'>
              <h1 className='text-2xl font-bold text-foreground'>
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
        <Card className='p-8 space-y-6'>
          {/* Header */}
          <div className='text-center space-y-4'>
            {channelOwner && (
              <div className='flex justify-center'>
                <Avatar preset={channelOwner.avatar} size='lg' />
              </div>
            )}
            <div className='space-y-2'>
              <h1 className='text-2xl font-bold text-foreground'>
                You've been invited!
              </h1>
              <p className='text-foreground/70'>
                {channelOwner
                  ? `${channelOwner.firstName} ${channelOwner.lastName} has invited you to join `
                  : 'You have been invited to join '}
                <Badge
                  variant='secondary'
                  className='inline-flex mx-1'
                  style={{ borderColor: channel.color }}
                >
                  {channel.name}
                </Badge>
              </p>
            </div>
          </div>

          {/* Already subscribed message */}
          {isAlreadySubscribed && (
            <div className='bg-muted/20 p-4 rounded-lg'>
              <p className='text-sm text-foreground/70 text-center'>
                You are already subscribed to this channel
              </p>
            </div>
          )}

          {/* Actions */}
          <div className='space-y-3'>
            <Button onClick={handleJoinChannel} className='w-full'>
              {isAlreadySubscribed ? 'Go to Channel' : 'Join Channel'}
            </Button>
            <Button onClick={handleDecline} variant='tertiary' className='w-full'>
              Decline
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default InviteAccept;
