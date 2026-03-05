import {
  Channel,
  generateChannelInviteLink,
  getColorPair,
} from '@/lib/channel';
import { User } from '@/lib/user';
import { useAppSelector } from '@/store/hooks';
import {
  Avatar,
  Badge,
  Button,
  CopyButton,
  Modal,
  Separator,
} from '@moondreamsdev/dreamer-ui/components';

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel | null;
  subscribers?: User[];
  onRefreshInviteCode?: (channel: Channel) => void;
}

export function ChannelModal({
  isOpen,
  onClose,
  channel,
  subscribers = [],
  onRefreshInviteCode,
}: ChannelModalProps) {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  if (!channel || !currentUser) return null;

  const isOwner = channel.ownerId === currentUser.id;

  const inviteUrl = generateChannelInviteLink(channel);

  const colors = getColorPair(channel);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Channel Details'>
      <div className='space-y-6'>
        {/* Channel Info */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Badge
              variant='base'
              className='px-3 py-1 text-base font-medium'
              style={{
                backgroundColor: colors.backgroundColor,
                color: colors.textColor,
              }}
            >
              {channel.name}
            </Badge>
            {channel.isDaily && (
              <span className='text-foreground/60 text-sm'>Daily Channel</span>
            )}
          </div>

          {channel.description && (
            <p className='text-foreground/70 whitespace-pre-wrap'>
              {channel.description}
            </p>
          )}

          {isOwner && (
            <p className='text-foreground/60 text-sm italic'>
              You own this channel
            </p>
          )}
        </div>

        {/* Invite Link Section - Only for owners */}
        {isOwner && (
          <>
            <Separator />
            <div className='space-y-3'>
              <h3 className='text-foreground text-lg font-semibold'>
                Invite People
              </h3>
              <p className='text-foreground/60 text-sm'>
                Share this link with others to invite them to join this channel
              </p>
              <CopyButton
                textToCopy={inviteUrl || ''}
                variant='secondary'
                className='w-full'
                disabled={!inviteUrl}
              >
                Copy Invite Link
              </CopyButton>
              {onRefreshInviteCode && (
                <Button
                  variant='tertiary'
                  className='w-full'
                  onClick={() => onRefreshInviteCode(channel)}
                >
                  Refresh Invite Code
                </Button>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* Subscribers List */}
        <div className='space-y-3'>
          <h3 className='text-foreground text-lg font-semibold'>
            Subscribers ({subscribers.length})
          </h3>

          <div className='max-h-60 space-y-2 overflow-y-auto'>
            {subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className='hover:bg-muted/20 flex items-center gap-3 rounded-lg p-2'
                >
                  <Avatar preset={subscriber.avatar} size='sm' />
                  <div className='flex-1'>
                    <p className='text-foreground text-sm font-medium'>
                      {subscriber.firstName} {subscriber.lastName}
                    </p>
                    <p className='text-foreground/60 text-xs'>
                      {subscriber.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-foreground/60 text-sm'>No subscribers yet</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
