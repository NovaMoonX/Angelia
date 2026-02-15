import {
  Channel,
  CHANNEL_FALLBACK_DESCRIPTION,
  getColorPair,
} from '@/lib/channel';
import { User } from '@/lib/user';
import { Badge, Button, Card } from '@moondreamsdev/dreamer-ui/components';
import { Trash } from '@moondreamsdev/dreamer-ui/symbols';
import { join } from '@moondreamsdev/dreamer-ui/utils';

interface ChannelCardProps {
  channel: Channel;
  owner?: User;
  onEdit?: (channel: Channel) => void;
  onDelete?: (channel: Channel) => void;
  onUnsubscribe?: (channel: Channel) => void;
  onClick?: (channel: Channel) => void;
  isOwner?: boolean;
}

export function ChannelCard({
  channel,
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

  const colors = getColorPair(channel);

  return (
    <Card className='p-4 transition-all'>
      <div
        className={join(
          'flex items-start justify-between gap-3',
          onClick && 'cursor-pointer',
        )}
        onClick={handleClick}
      >
        <div className='flex-1 space-y-2'>
          <div className='flex items-center gap-2'>
            <Badge
              variant='base'
              className='text-sm font-medium'
              style={{
                backgroundColor: colors.backgroundColor,
                color: colors.textColor,
              }}
            >
              {channel.name}
            </Badge>
          </div>
          <p className='text-foreground/70 line-clamp-1 text-sm'>
            {channel.description || CHANNEL_FALLBACK_DESCRIPTION}
          </p>
          {owner && (
            <p className='text-foreground/50 text-xs'>
              by {owner.firstName} {owner.lastName}
            </p>
          )}
        </div>

        {isOwner && (
          <div className='flex items-center gap-2'>
            {onEdit && !channel.isDaily && (
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
                <Trash className='h-4 w-4' />
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
