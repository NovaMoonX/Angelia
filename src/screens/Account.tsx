import {
  Channel,
  CUSTOM_CHANNEL_LIMIT,
  getColorPair,
  NewChannel,
  UserChannelInvite,
} from '@/lib/channel';
import { getUserById, User } from '@/lib/user';
import {
  createCustomChannel,
  deleteCustomChannel,
  updateCustomChannel,
} from '@/store/actions/channelActions';
import { ChannelCard } from '@components/ChannelCard';
import { ChannelFormModal } from '@components/ChannelFormModal';
import { ChannelModal } from '@components/ChannelModal';
import { useAuth } from '@hooks/useAuth';
import { CHANNEL_COLOR_MAP } from '@lib/channelColors';
import { getRelativeTime } from '@lib/timeUtils';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Input,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from '@moondreamsdev/dreamer-ui/components';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { updateChannel } from '@store/slices/channelsSlice';
import { updateInvite } from '@store/slices/invitesSlice';
import { updateUserProfile } from '@store/actions/userActions';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

function formatJoinDate(timestamp: number): string {
  const date = new Date(timestamp);
  const result = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return result;
}

type AccountFormData = Pick<User, 'firstName' | 'lastName' | 'funFact'>;
type AccountTab = 'account' | 'my-channels' | 'subscribed';

interface ChannelFormData {
  name: string;
  description: string;
  color: string;
}

export function Account() {
  const [searchParams, setSearchParams] = useSearchParams();
  const actionModal = useActionModal();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  // Get data from Redux store
  const channels = useAppSelector((state) => state.channels.items);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const users = useAppSelector((state) => state.users.users);
  const userChannelInvites = useAppSelector((state) => state.invites.items);

  // Get active tab from query params, default to 'account'
  const activeTab = useMemo(() => {
    const tab = searchParams.get('tab') || '';
    const validTabs: AccountTab[] = ['my-channels', 'subscribed'];
    const result = validTabs.includes(tab as AccountTab) ? tab : 'account';

    return result;
  }, [searchParams]);

  // Scroll to notifications if view=notifications
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'notifications' && notificationsRef.current) {
      // Use requestAnimationFrame to ensure DOM is fully rendered before scrolling
      requestAnimationFrame(() => {
        notificationsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    }
  }, [searchParams]);

  // Combined form state
  const [formData, setFormData] = useState<AccountFormData>({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    funFact: currentUser?.funFact || '',
  });

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        funFact: currentUser.funFact,
      });
    }
  }, [currentUser]);

  // Channel modal states
  const [isChannelFormOpen, setIsChannelFormOpen] = useState(false);
  const [isChannelDetailOpen, setIsChannelDetailOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channelFormMode, setChannelFormMode] = useState<'create' | 'edit'>(
    'create',
  );

  // Memoized: Find channels owned by the current user
  const userOwnedChannels = useMemo(() => {
    if (!currentUser) return [];
    const result = channels.filter(
      (channel) => channel.ownerId === currentUser.id,
    );

    return result;
  }, [channels, currentUser]);

  // Memoized: Find user's daily channel (from owned channels)
  const userDailyChannel = useMemo(() => {
    const result = userOwnedChannels.find((channel) => channel.isDaily);

    return result;
  }, [userOwnedChannels]);

  // Memoized: Find channels the user has access to (subscribed)
  const subscribedChannels = useMemo(() => {
    if (!currentUser) return [];
    const result = channels.filter(
      (channel) =>
        channel.subscribers.includes(currentUser.id) &&
        channel.ownerId !== currentUser.id,
    );

    return result;
  }, [channels, currentUser]);

  // Memoized: Create channel map for O(1) lookups
  const channelsMap = useMemo(() => {
    const result = new Map(channels.map((ch) => [ch.id, ch]));

    return result;
  }, [channels]);

  // Memoized: Create users map for O(1) lookups
  const usersMap = useMemo(() => {
    const result = new Map(users.map((user) => [user.id, user]));

    return result;
  }, [users]);

  // Memoized: Count non-daily channels owned by user
  const nonDailyChannelCount = useMemo(() => {
    const result = userOwnedChannels.filter((ch) => !ch.isDaily).length;

    return result;
  }, [userOwnedChannels]);

  // Memoized: Get all existing channel names owned by user
  const existingChannelNames = useMemo(() => {
    const result = userOwnedChannels.map((ch) => ch.name);

    return result;
  }, [userOwnedChannels]);

  // Memoized: Get subscribers for selected channel
  const selectedChannelSubscribers = useMemo(() => {
    if (!selectedChannel) {
      return [];
    }

    const result = selectedChannel.subscribers
      .map((id) => users.find((user) => user.id === id))
      .filter((user): user is User => user !== undefined);

    return result;
  }, [selectedChannel, users]);

  // Memoized: Get pending invites
  const pendingInvites = useMemo(() => {
    const result = userChannelInvites.filter(
      (invite) => invite.status === 'pending',
    );

    return result;
  }, [userChannelInvites]);

  // Memoized: Get declined invites
  const declinedInvites = useMemo(() => {
    const result = userChannelInvites.filter(
      (invite) => invite.status === 'declined',
    );

    return result;
  }, [userChannelInvites]);

  // Memoized: Count of pending invites for badge
  const pendingInviteCount = useMemo(() => {
    const result = pendingInvites.length;

    return result;
  }, [pendingInvites]);

  const formattedJoinDate = useMemo(() => {
    if (!currentUser?.joinedAt) return 'N/A';
    return formatJoinDate(currentUser.joinedAt);
  }, [currentUser]);

  const handleFormChange = (field: keyof AccountFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateAccount = async () => {
    if (!currentUser) return;

    try {
      // Persist changes to Firestore; listener will update local Redux state.
      await dispatch(
        updateUserProfile({ uid: currentUser.id, data: formData }),
      ).unwrap();
      actionModal.alert({ title: 'Success', message: 'Your account has been updated!' });
    } catch (err) {
      console.error('Failed to update profile:', err);
      actionModal.alert({
        title: 'Update failed',
        message: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  };

  const handleTabChange = (value: string) => {
    const valueAsTab = value as AccountTab;
    if (valueAsTab === 'account') {
      setSearchParams(
        (prev) => {
          prev.delete('tab');
          return prev;
        },
        {
          replace: true,
        },
      );
      return;
    }
    setSearchParams(
      { tab: value },
      {
        replace: true,
      },
    );
  };

  // Channel handlers
  const handleCreateChannel = () => {
    setChannelFormMode('create');
    setSelectedChannel(null);
    setIsChannelFormOpen(true);
  };

  const handleEditChannel = (channel: Channel) => {
    setChannelFormMode('edit');
    setSelectedChannel(channel);
    setIsChannelFormOpen(true);
  };

  const handleDeleteChannel = async (channel: Channel) => {
    const confirmed = await actionModal.confirm({
      title: 'Delete Channel',
      message: `Are you sure you want to delete "${channel.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      destructive: true,
    });

    if (confirmed) {
      try {
        await dispatch(deleteCustomChannel(channel.id));
        console.log('Deleted channel:', channel.id);
      } catch (err) {
        console.error('Error deleting channel:', err);
        actionModal.alert({
          title: 'Unable to delete channel',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }
  };

  const handleUnsubscribe = async (channel: Channel) => {
    const confirmed = await actionModal.confirm({
      title: 'Unsubscribe from Channel',
      message: `Are you sure you want to unsubscribe from "${channel.name}"? You can always subscribe again later.`,
      confirmText: 'Unsubscribe',
      cancelText: 'Cancel',
      destructive: false,
    });

    if (confirmed && currentUser) {
      // Unsubscribe using Redux
      const updatedChannel = {
        ...channel,
        subscribers: channel.subscribers.filter((id) => id !== currentUser.id),
      };
      dispatch(updateChannel(updatedChannel));
      console.log('Unsubscribing from channel:', channel.id);
    }
  };

  const handleViewChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setIsChannelDetailOpen(true);
  };

  const handleChannelFormSubmit = async (data: ChannelFormData) => {
    if (!currentUser) return;

    if (channelFormMode === 'create') {
      if (nonDailyChannelCount >= 3) {
        actionModal.alert({
          message:
            'You have reached the maximum number of channels (3). Please delete an existing channel before creating a new one.',
        });
        return;
      }
      // Create channel using Redux
      const newChannel: NewChannel = {
        name: data.name,
        description: data.description,
        color: data.color,
        ownerId: currentUser.id,
        subscribers: [currentUser.id],
      };

      try {
        await dispatch(createCustomChannel(newChannel));
      } catch (err) {
        actionModal.alert({
          title: 'Unable to create channel',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    } else if (selectedChannel) {
      // Update channel using Firestore
      const updatedChannel = {
        ...selectedChannel,
        name: data.name,
        description: data.description,
        color: data.color,
      };
      try {
        await dispatch(updateCustomChannel(updatedChannel));
        console.log('Updated channel:', selectedChannel.id, data);
      } catch (err) {
        console.error('Error updating channel:', err);
        actionModal.alert({
          title: 'Unable to update channel',
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }
  };

  // Invite handlers
  const handleAcceptInvite = (invite: UserChannelInvite, timestamp: number) => {
    if (!currentUser) return;

    // Accept invite using Redux
    const updatedInvite: UserChannelInvite = {
      ...invite,
      status: 'accepted' as const,
      respondedAt: timestamp,
    };
    dispatch(updateInvite(updatedInvite));

    // Add current user to channel subscribers if not already subscribed
    const channel = channels.find((ch) => ch.id === invite.channelId);
    if (channel && !channel.subscribers.includes(currentUser.id)) {
      const updatedChannel = {
        ...channel,
        subscribers: [...channel.subscribers, currentUser.id],
      };
      dispatch(updateChannel(updatedChannel));
    }
  };

  const handleDeclineInvite = (invite: UserChannelInvite) => {
    const now = Date.now();
    // Decline invite using Redux
    const updatedInvite: UserChannelInvite = {
      ...invite,
      status: 'declined' as const,
      respondedAt: now,
    };
    dispatch(updateInvite(updatedInvite));
  };

  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-2xl space-y-6 px-4 py-6'>
        {/* Header */}
        <div className='mt-4 space-y-2'>
          <div className='mb-10 flex items-center gap-4'>
            <Link
              to='/feed'
              className='text-foreground/60 hover:text-foreground transition-colors'
            >
              ← Back to Feed
            </Link>
          </div>
          <h1 className='text-foreground text-3xl font-bold'>Account</h1>
          <p className='text-foreground/60'>
            Manage your profile and preferences
          </p>
        </div>

        {/* Profile Section with Tabs */}
        <Card className='space-y-6 p-6'>
          {/* Avatar and Basic Info */}
          <div className='flex flex-col items-center space-y-4'>
            <Avatar preset={currentUser?.avatar || 'moon'} size='xl' />
            <div className='text-center'>
              <h2 className='text-foreground text-2xl font-semibold'>
                {formData.firstName} {formData.lastName}
              </h2>
              <p className='text-foreground/60 text-sm'>
                {currentUser?.email || ''}
              </p>
              <p className='text-foreground/40 mt-2 text-xs'>
                Joined {formattedJoinDate}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            tabsWidth='full'
            className='mt-5'
          >
            <TabsList>
              <TabsTrigger value='account'>Account</TabsTrigger>
              <TabsTrigger value='my-channels'>My Channels</TabsTrigger>
              <TabsTrigger value='subscribed'>Subscribed Channels</TabsTrigger>
            </TabsList>

            {/* Account Tab Content */}
            <TabsContent value='account' className='mt-4 space-y-4'>
              {/* First Name */}
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  type='text'
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFormChange('firstName', e.target.value)
                  }
                />
              </div>

              {/* Last Name */}
              <div className='space-y-2'>
                <Label htmlFor='lastName'>Last Name</Label>
                <Input
                  id='lastName'
                  type='text'
                  value={formData.lastName}
                  onChange={(e) => handleFormChange('lastName', e.target.value)}
                />
              </div>

              {/* Fun Facts */}
              <div className='space-y-2'>
                <Label htmlFor='funFact'>Fun Facts About You</Label>
                <Textarea
                  id='funFact'
                  value={formData.funFact}
                  onChange={(e) => handleFormChange('funFact', e.target.value)}
                  placeholder='Share some fun facts about yourself...'
                  rows={4}
                />
              </div>

              {/* Update Button */}
              <div className='pt-2'>
                <Button onClick={handleUpdateAccount} className='w-full'>
                  Update Account
                </Button>
              </div>

              {/* Sign Out Section */}
              <Separator className='my-4' />
              <div className='pt-2'>
                <Button
                  variant='tertiary'
                  onClick={async () => {
                    try {
                      await signOut();
                      navigate('/auth');
                    } catch (err) {
                      console.error('Sign out error:', err);
                      actionModal.alert({
                        message:
                          'An error occurred while signing out. Please try again.',
                      });
                    }
                  }}
                  className='w-full'
                >
                  Sign Out
                </Button>
              </div>
            </TabsContent>

            {/* My Channels Tab Content */}
            <TabsContent value='my-channels' className='mt-4 space-y-4'>
              {/* Daily Channel Section */}
              {userDailyChannel && (
                <>
                  <div className='space-y-2'>
                    <p className='text-foreground/80 text-sm font-medium'>
                      Daily Channel
                    </p>
                    <ChannelCard
                      channel={userDailyChannel}
                      onClick={handleViewChannel}
                      onEdit={handleEditChannel}
                      isOwner={true}
                    />
                  </div>
                  {userOwnedChannels.filter((ch) => !ch.isDaily).length > 0 && (
                    <Separator />
                  )}
                </>
              )}

              {/* Other Channels Section */}
              {userOwnedChannels.filter((ch) => !ch.isDaily).length > 0 && (
                <div className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <p className='text-foreground/80 text-sm font-medium'>
                      Other Channels
                    </p>
                    <p className='text-foreground/60 text-xs'>
                      {nonDailyChannelCount} / {CUSTOM_CHANNEL_LIMIT} channels
                    </p>
                  </div>
                  <div className='space-y-2'>
                    {userOwnedChannels
                      .filter((ch) => !ch.isDaily)
                      .map((channel) => (
                        <ChannelCard
                          key={channel.id}
                          channel={channel}
                          onClick={handleViewChannel}
                          onEdit={handleEditChannel}
                          onDelete={handleDeleteChannel}
                          isOwner={true}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Create Channel Button */}
              <div className='pt-2'>
                <Button
                  onClick={handleCreateChannel}
                  disabled={nonDailyChannelCount >= CUSTOM_CHANNEL_LIMIT}
                  className='w-full'
                >
                  {nonDailyChannelCount >= CUSTOM_CHANNEL_LIMIT
                    ? `Maximum Channels Reached (${CUSTOM_CHANNEL_LIMIT}/${CUSTOM_CHANNEL_LIMIT})`
                    : 'Create New Channel'}
                </Button>
                {nonDailyChannelCount >= CUSTOM_CHANNEL_LIMIT && (
                  <p className='text-foreground/60 mt-2 text-center text-xs'>
                    You can create up to {CUSTOM_CHANNEL_LIMIT} custom channels
                    to encourage intentionality
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Subscribed Channels Tab Content */}
            <TabsContent value='subscribed' className='mt-4 space-y-4'>
              {subscribedChannels.length > 0 ? (
                <div className='space-y-2'>
                  <p className='text-foreground/80 text-sm font-medium'>
                    Channels You Follow ({subscribedChannels.length})
                  </p>
                  <div className='space-y-2'>
                    {subscribedChannels.map((channel) => {
                      const owner = getUserById(channel.ownerId);
                      return (
                        <ChannelCard
                          key={channel.id}
                          channel={channel}
                          owner={owner}
                          onClick={handleViewChannel}
                          onUnsubscribe={handleUnsubscribe}
                          isOwner={false}
                        />
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className='text-foreground/60 text-sm'>
                  You are not subscribed to any channels yet.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </Card>

        {/* Notifications Section - Separate Card */}
        <div className='space-y-4' ref={notificationsRef}>
          <div>
            <h2 className='text-foreground text-2xl font-semibold'>
              Notifications
              {pendingInviteCount > 0 && (
                <span className='text-foreground/60 ml-2 text-xl'>
                  ({pendingInviteCount})
                </span>
              )}
            </h2>
            <p className='text-foreground/60 mt-1 text-sm'>
              Manage your channel invitations
            </p>
          </div>

          <Card className='space-y-4 p-6'>
            {/* Pending Invites Section */}
            {pendingInvites.length > 0 && (
              <div className='space-y-2'>
                <p className='text-foreground/80 text-sm font-medium'>
                  Pending Invites ({pendingInvites.length})
                </p>
                <div className='space-y-2'>
                  {pendingInvites.map((invite) => {
                    const channel = channelsMap.get(invite.channelId);
                    const inviter = usersMap.get(invite.invitedBy);

                    if (!channel || !inviter) {
                      return null;
                    }

                    const colorData = CHANNEL_COLOR_MAP.get(channel.color);
                    const badgeColors = {
                      backgroundColor: colorData?.value || '#c7d2fe',
                      textColor: colorData?.textColor || '#4338ca',
                    };

                    return (
                      <Card key={invite.id} className='p-4'>
                        <div className='space-y-3'>
                          <div className='flex items-start justify-between gap-3'>
                            <div className='flex-1 space-y-1'>
                              <div className='flex items-center gap-2'>
                                <p className='text-foreground text-sm font-medium'>
                                  {inviter.firstName} {inviter.lastName}
                                </p>
                                <span className='text-foreground/40 text-xs'>
                                  invited you to
                                </span>
                              </div>
                              <Badge
                                variant='base'
                                className='text-sm font-medium'
                                style={{
                                  backgroundColor: badgeColors.backgroundColor,
                                  borderColor: badgeColors.backgroundColor,
                                  color: badgeColors.textColor,
                                }}
                              >
                                {channel.name}
                              </Badge>
                              <p className='text-foreground/60 text-xs'>
                                {getRelativeTime(invite.invitedAt)}
                              </p>
                            </div>
                          </div>
                          <div className='flex gap-2'>
                            <Button
                              size='sm'
                              onClick={() =>
                                handleAcceptInvite(invite, Date.now())
                              }
                              className='flex-1'
                            >
                              Accept
                            </Button>
                            <Button
                              variant='secondary'
                              size='sm'
                              onClick={() => handleDeclineInvite(invite)}
                              className='flex-1'
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Separator between pending and declined */}
            {pendingInvites.length > 0 && declinedInvites.length > 0 && (
              <Separator />
            )}

            {/* Declined Invites Section */}
            {declinedInvites.length > 0 && (
              <div className='space-y-2'>
                <p className='text-foreground/80 text-sm font-medium'>
                  Declined Invites ({declinedInvites.length})
                </p>
                <div className='space-y-2'>
                  {declinedInvites.map((invite) => {
                    const channel = channelsMap.get(invite.channelId);
                    const inviter = usersMap.get(invite.invitedBy);

                    if (!channel || !inviter) {
                      return null;
                    }

                    const badgeColors = getColorPair(channel);

                    return (
                      <Card key={invite.id} className='p-4 opacity-60'>
                        <div className='space-y-1'>
                          <div className='flex items-center gap-2'>
                            <p className='text-foreground text-sm font-medium'>
                              {inviter.firstName} {inviter.lastName}
                            </p>
                            <span className='text-foreground/40 text-xs'>
                              invited you to
                            </span>
                          </div>
                          <Badge
                            variant='base'
                            className='text-sm font-medium'
                            style={{
                              backgroundColor: badgeColors.backgroundColor,
                              borderColor: badgeColors.backgroundColor,
                              color: badgeColors.textColor,
                            }}
                          >
                            {channel.name}
                          </Badge>
                          <p className='text-foreground/60 text-xs'>
                            Declined {getRelativeTime(invite.respondedAt!)}
                          </p>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {pendingInvites.length === 0 && declinedInvites.length === 0 && (
              <p className='text-foreground/60 py-8 text-center text-sm'>
                No notifications yet. When someone invites you to a channel,
                you'll see it here.
              </p>
            )}
          </Card>
        </div>

        {/* Channel Form Modal */}
        <ChannelFormModal
          isOpen={isChannelFormOpen}
          onClose={() => setIsChannelFormOpen(false)}
          onSubmit={handleChannelFormSubmit}
          channel={selectedChannel}
          mode={channelFormMode}
          existingChannelNames={existingChannelNames}
        />

        {/* Channel Detail Modal */}
        <ChannelModal
          isOpen={isChannelDetailOpen}
          onClose={() => setIsChannelDetailOpen(false)}
          channel={selectedChannel}
          subscribers={selectedChannelSubscribers}
        />
      </div>
    </div>
  );
}

export default Account;
