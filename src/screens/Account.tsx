import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Avatar,
  Card,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Label,
  Button,
  Separator,
} from '@moondreamsdev/dreamer-ui/components';
import { useActionModal } from '@moondreamsdev/dreamer-ui/hooks';
import { mockCurrentUser, mockChannels, User, Channel, getUserById } from '@lib/mockData';
import { ChannelCard } from '@components/ChannelCard';
import { ChannelFormModal } from '@components/ChannelFormModal';
import { ChannelModal } from '@components/ChannelModal';

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

// Mock channel descriptions (in real app, this would come from database)
const channelDescriptions: Record<string, string> = {
  'user1-daily': 'Daily updates and life moments',
  'channel2': 'Sharing delicious recipes and cooking adventures',
  'channel3': 'Celebrating big achievements and special moments',
  'channel4': 'Updates from the garden and growing tips',
  'user4-daily': 'Daily thoughts and experiences',
  'channel1': 'Family trips, vacations, and adventures together',
  'user6-daily': 'Daily reflections and musings',
  'user3-daily': 'Day-to-day life and casual updates',
  'currentUser-daily': 'My daily updates and life moments',
};

export function Account() {
  const [searchParams, setSearchParams] = useSearchParams();
  const actionModal = useActionModal();
  
  // Get active tab from query params, default to 'account'
  const activeTab = useMemo(() => {
    const tab = searchParams.get('tab') || '';
    const channelTabs: AccountTab[] = ['my-channels', 'subscribed'];
    const result = channelTabs.includes(tab as AccountTab) ? tab : 'account';
    
    return result;
  }, [searchParams]);

  // Combined form state
  const [formData, setFormData] = useState<AccountFormData>({
    firstName: mockCurrentUser.firstName,
    lastName: mockCurrentUser.lastName,
    funFact: mockCurrentUser.funFact,
  });

  // Channel modal states
  const [isChannelFormOpen, setIsChannelFormOpen] = useState(false);
  const [isChannelDetailOpen, setIsChannelDetailOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [channelFormMode, setChannelFormMode] = useState<'create' | 'edit'>('create');
  const [channels, setChannels] = useState(mockChannels);

  // Memoized: Find channels owned by the current user
  const userOwnedChannels = useMemo(() => {
    const result = channels.filter(
      (channel) => channel.ownerId === mockCurrentUser.id,
    );
    
    return result;
  }, [channels]);

  // Memoized: Find user's daily channel (from owned channels)
  const userDailyChannel = useMemo(() => {
    const result = userOwnedChannels.find((channel) => channel.isDaily);
    
    return result;
  }, [userOwnedChannels]);

  // Memoized: Find channels the user has access to (subscribed)
  const subscribedChannels = useMemo(() => {
    const result = channels.filter(
      (channel) =>
        channel.subscribers.includes(mockCurrentUser.id) &&
        channel.ownerId !== mockCurrentUser.id,
    );
    
    return result;
  }, [channels]);

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

  const formattedJoinDate = formatJoinDate(mockCurrentUser.joinedAt);

  const handleFormChange = (field: keyof AccountFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateAccount = () => {
    // Mock update function - in real app would call API
    console.log('Updating account with:', formData);
    // Show success feedback (could use toast notification)
    alert('Account updated successfully!');
  };

  const handleTabChange = (value: string) => {
    const valueAsTab = value as AccountTab;
    if (valueAsTab === 'account') {
      setSearchParams((prev) => {
        prev.delete('tab');
        return prev;
      }, {
        replace: true,
      });
      return;
    }
    setSearchParams({ tab: value }, {
      replace: true,
    });
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
      // Mock delete - in real app would call API
      setChannels((prev) => prev.filter((ch) => ch.id !== channel.id));
      console.log('Deleting channel:', channel.id);
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

    if (confirmed) {
      // Mock unsubscribe - in real app would call API
      setChannels((prev) =>
        prev.map((ch) =>
          ch.id === channel.id
            ? {
                ...ch,
                subscribers: ch.subscribers.filter((id) => id !== mockCurrentUser.id),
              }
            : ch
        )
      );
      console.log('Unsubscribing from channel:', channel.id);
    }
  };

  const handleViewChannel = (channel: Channel) => {
    setSelectedChannel(channel);
    setIsChannelDetailOpen(true);
  };

  const handleChannelFormSubmit = (data: ChannelFormData) => {
    if (channelFormMode === 'create') {
      // Mock create - in real app would call API
      const newChannel: Channel = {
        id: `channel-${Date.now()}`,
        name: data.name,
        color: data.color,
        isDaily: false,
        ownerId: mockCurrentUser.id,
        subscribers: [mockCurrentUser.id],
      };
      setChannels((prev) => [...prev, newChannel]);
      channelDescriptions[newChannel.id] = data.description;
      console.log('Creating channel:', newChannel);
    } else if (selectedChannel) {
      // Mock update - in real app would call API
      setChannels((prev) =>
        prev.map((ch) =>
          ch.id === selectedChannel.id
            ? { ...ch, name: data.name, color: data.color }
            : ch
        )
      );
      channelDescriptions[selectedChannel.id] = data.description;
      console.log('Updating channel:', selectedChannel.id, data);
    }
  };

  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-2xl px-4 py-6 space-y-6'>
        {/* Header */}
        <div className='space-y-2 mt-4'>
          <div className='flex items-center gap-4 mb-10'>
            <Button
              variant='link'
              href='/feed'
              className='text-foreground/60 hover:text-foreground'
            >
              ← Back to Feed
            </Button>
          </div>
          <h1 className='text-3xl font-bold text-foreground'>Account</h1>
          <p className='text-foreground/60'>Manage your profile and preferences</p>
        </div>

        {/* Profile Section with Tabs */}
        <Card className='p-6 space-y-6'>
          {/* Avatar and Basic Info */}
          <div className='flex flex-col items-center space-y-4'>
            <Avatar preset={mockCurrentUser.avatar} size='xl' />
            <div className='text-center'>
              <h2 className='text-2xl font-semibold text-foreground'>
                {formData.firstName} {formData.lastName}
              </h2>
              <p className='text-sm text-foreground/60'>{mockCurrentUser.email}</p>
              <p className='text-xs text-foreground/40 mt-2'>
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
            <TabsContent value='account' className='space-y-4 mt-4'>
              {/* First Name */}
              <div className='space-y-2'>
                <Label htmlFor='firstName'>First Name</Label>
                <Input
                  id='firstName'
                  type='text'
                  value={formData.firstName}
                  onChange={(e) => handleFormChange('firstName', e.target.value)}
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
            </TabsContent>

            {/* My Channels Tab Content */}
            <TabsContent value='my-channels' className='space-y-4 mt-4'>
              {/* Daily Channel Section */}
              {userDailyChannel && (
                <>
                  <div className='space-y-2'>
                    <p className='text-sm font-medium text-foreground/80'>Daily Channel</p>
                    <ChannelCard
                      channel={userDailyChannel}
                      description={channelDescriptions[userDailyChannel.id]}
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
                    <p className='text-sm font-medium text-foreground/80'>Other Channels</p>
                    <p className='text-xs text-foreground/60'>
                      {nonDailyChannelCount} / 3 channels
                    </p>
                  </div>
                  <div className='space-y-2'>
                    {userOwnedChannels
                      .filter((ch) => !ch.isDaily)
                      .map((channel) => (
                        <ChannelCard
                          key={channel.id}
                          channel={channel}
                          description={channelDescriptions[channel.id]}
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
                  disabled={nonDailyChannelCount >= 3}
                  className='w-full'
                >
                  {nonDailyChannelCount >= 3
                    ? 'Maximum Channels Reached (3/3)'
                    : 'Create New Channel'}
                </Button>
                {nonDailyChannelCount >= 3 && (
                  <p className='text-xs text-foreground/60 text-center mt-2'>
                    You can create up to 3 custom channels to encourage intentionality
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Subscribed Channels Tab Content */}
            <TabsContent value='subscribed' className='space-y-4 mt-4'>
              {subscribedChannels.length > 0 ? (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-foreground/80'>
                    Channels You Follow ({subscribedChannels.length})
                  </p>
                  <div className='space-y-2'>
                    {subscribedChannels.map((channel) => {
                      const owner = getUserById(channel.ownerId);
                      return (
                        <ChannelCard
                          key={channel.id}
                          channel={channel}
                          description={channelDescriptions[channel.id]}
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
                <p className='text-sm text-foreground/60'>You are not subscribed to any channels yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </Card>

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
          description={selectedChannel ? channelDescriptions[selectedChannel.id] : undefined}
          subscribers={[]} // Mock - in real app would fetch subscribers
        />
      </div>
    </div>
  );
}

export default Account;
