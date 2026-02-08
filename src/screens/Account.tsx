import { useState, useMemo } from 'react';
import {
  Avatar,
  Badge,
  Card,
  Textarea,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Label,
  Button,
} from '@moondreamsdev/dreamer-ui/components';
import { mockCurrentUser, mockChannels } from '@lib/mockData';

function formatJoinDate(timestamp: number): string {
  const date = new Date(timestamp);
  const result = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return result;
}

interface AccountFormData {
  firstName: string;
  lastName: string;
  funFact: string;
}

export function Account() {
  // Combined form state
  const [formData, setFormData] = useState<AccountFormData>({
    firstName: mockCurrentUser.firstName,
    lastName: mockCurrentUser.lastName,
    funFact: mockCurrentUser.funFact,
  });

  // Memoized: Find channels owned by the current user
  const userOwnedChannels = useMemo(() => {
    const result = mockChannels.filter(
      (channel) => channel.ownerId === mockCurrentUser.id,
    );
    
    return result;
  }, []);

  // Memoized: Find user's daily channel (from owned channels)
  const userDailyChannel = useMemo(() => {
    const result = userOwnedChannels.find((channel) => channel.isDaily);
    
    return result;
  }, [userOwnedChannels]);

  // Memoized: Find channels the user has access to (subscribed)
  const subscribedChannels = useMemo(() => {
    const result = mockChannels.filter(
      (channel) =>
        channel.subscribers.includes(mockCurrentUser.id) &&
        channel.ownerId !== mockCurrentUser.id,
    );
    
    return result;
  }, []);

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

  return (
    <div className='page flex flex-col items-center overflow-y-auto'>
      <div className='w-full max-w-2xl px-4 py-6 space-y-6'>
        {/* Header */}
        <div className='space-y-2'>
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
          <Tabs defaultValue='account' tabsWidth='full'>
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
              {userDailyChannel && (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-foreground/80'>Daily Channel</p>
                  <div className='flex items-center gap-2'>
                    <Badge
                      variant='secondary'
                      className='text-sm font-medium'
                      style={{ borderColor: userDailyChannel.color }}
                    >
                      {userDailyChannel.name}
                    </Badge>
                  </div>
                </div>
              )}

              {userOwnedChannels.filter((ch) => !ch.isDaily).length > 0 && (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-foreground/80'>Other Channels</p>
                  <div className='flex flex-wrap gap-2'>
                    {userOwnedChannels
                      .filter((ch) => !ch.isDaily)
                      .map((channel) => (
                        <Badge
                          key={channel.id}
                          variant='secondary'
                          className='text-sm font-medium'
                          style={{ borderColor: channel.color }}
                        >
                          {channel.name}
                        </Badge>
                      ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Subscribed Channels Tab Content */}
            <TabsContent value='subscribed' className='space-y-4 mt-4'>
              {subscribedChannels.length > 0 ? (
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-foreground/80'>Channels You Follow</p>
                  <div className='flex flex-wrap gap-2'>
                    {subscribedChannels.map((channel) => (
                      <Badge
                        key={channel.id}
                        variant='secondary'
                        className='text-sm font-medium'
                        style={{ borderColor: channel.color }}
                      >
                        {channel.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className='text-sm text-foreground/60'>You are not subscribed to any channels yet.</p>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}

export default Account;
