import { Card, Badge, Button } from '@moondreamsdev/dreamer-ui/components';
import { Trash } from '@moondreamsdev/dreamer-ui/symbols';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import { CHANNEL_COLOR_MAP } from '@lib/channelColors';
import { Channel, CHANNEL_FALLBACK_DESCRIPTION } from '@/lib/channel';
import { User } from '@/lib/user';

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

  const getColorPair = () => {
    const colorData = CHANNEL_COLOR_MAP.get(channel.color);
    return {
      backgroundColor: colorData?.value || '#c7d2fe',
      textColor: colorData?.textColor || '#4338ca',
    };
  };

  const colors = getColorPair();

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
              variant='base'
              className='text-sm font-medium'
              style={{ 
                backgroundColor: colors.backgroundColor, 
                borderColor: colors.backgroundColor,
                color: colors.textColor
              }}
            >
              {channel.name}
            </Badge>
          </div>
          <p className='text-sm text-foreground/70 line-clamp-1'>
            {channel.description || CHANNEL_FALLBACK_DESCRIPTION}
          </p>
          {owner && (
            <p className='text-xs text-foreground/50'>
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
