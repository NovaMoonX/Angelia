import { Modal, Badge, Avatar, Separator } from '@moondreamsdev/dreamer-ui/components';
import type { Channel, User } from '@lib/mockData';
import { mockCurrentUser } from '@lib/mockData';

interface ChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel | null;
  description?: string;
  subscribers?: User[];
}

export function ChannelModal({
  isOpen,
  onClose,
  channel,
  description,
  subscribers = [],
}: ChannelModalProps) {
  if (!channel) return null;

  const isOwner = channel.ownerId === mockCurrentUser.id;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Channel Details'
    >
      <div className='space-y-6'>
        {/* Channel Info */}
        <div className='space-y-3'>
          <div className='flex items-center gap-2'>
            <Badge
              variant='secondary'
              className='text-base font-medium px-3 py-1'
              style={{ borderColor: channel.color }}
            >
              {channel.name}
            </Badge>
            {channel.isDaily && (
              <span className='text-sm text-foreground/60'>Daily Channel</span>
            )}
          </div>

          {description && (
            <p className='text-foreground/70 whitespace-pre-wrap'>{description}</p>
          )}

          {isOwner && (
            <p className='text-sm text-foreground/60 italic'>You own this channel</p>
          )}
        </div>

        <Separator />

        {/* Subscribers List */}
        <div className='space-y-3'>
          <h3 className='text-lg font-semibold text-foreground'>
            Subscribers ({subscribers.length})
          </h3>

          <div className='space-y-2 max-h-60 overflow-y-auto'>
            {subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className='flex items-center gap-3 p-2 rounded-lg hover:bg-muted/20'
                >
                  <Avatar preset={subscriber.avatar} size='sm' />
                  <div className='flex-1'>
                    <p className='text-sm font-medium text-foreground'>
                      {subscriber.firstName} {subscriber.lastName}
                    </p>
                    <p className='text-xs text-foreground/60'>{subscriber.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-sm text-foreground/60'>No subscribers yet</p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
