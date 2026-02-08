import { Card, Badge, Button } from '@moondreamsdev/dreamer-ui/components';
import { Trash } from '@moondreamsdev/dreamer-ui/symbols';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import type { Channel, User } from '@lib/mockData';

interface ChannelCardProps {
  channel: Channel;
  description?: string;
  owner?: User;
  onEdit?: (channel: Channel) => void;
  onDelete?: (channel: Channel) => void;
  onUnsubscribe?: (channel: Channel) => void;
  onClick?: (channel: Channel) => void;
  isOwner?: boolean;
}

export function ChannelCard({
  channel,
  description,
  owner,
  onEdit,
  onDelete,
  onUnsubscribe,
  onClick,
  isOwner = false,
}: ChannelCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(channel);
    }
  };

  return (
    <Card className='p-4 transition-all'>
      <div 
        className={join(
          'flex items-start justify-between gap-3',
          onClick && 'cursor-pointer'
        )}
        onClick={handleClick}
      >
        <div className='flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            <Badge
              variant='secondary'
              className='text-sm font-medium'
              style={{ backgroundColor: channel.color, borderColor: channel.color }}
            >
              {channel.name}
            </Badge>
            {channel.isDaily && (
              <span className='text-xs text-foreground/40'>Daily</span>
            )}
          </div>
          <p className='text-sm text-foreground/70 line-clamp-1'>
            {description || 'No description provided'}
          </p>
          {owner && (
            <p className='text-xs text-foreground/50'>
              by {owner.firstName} {owner.lastName}
            </p>
          )}
        </div>

        {isOwner && (
          <div className='flex items-center gap-2'>
            {onEdit && (
              <Button
                variant='tertiary'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(channel);
                }}
                aria-label={`Edit ${channel.name}`}
              >
                Edit
              </Button>
            )}
            {onDelete && !channel.isDaily && (
              <Button
                variant='tertiary'
                size='sm'
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(channel);
                }}
                aria-label={`Delete ${channel.name}`}
              >
                <Trash className='w-4 h-4' />
              </Button>
            )}
          </div>
        )}

        {!isOwner && onUnsubscribe && (
          <div className='flex items-center gap-2'>
            <Button
              variant='link'
              size='sm'
              onClick={(e) => {
                e.stopPropagation();
                onUnsubscribe(channel);
              }}
              className='text-foreground/60 hover:text-foreground'
            >
              Unsubscribe
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
