import { Card, Badge, Button } from '@moondreamsdev/dreamer-ui/components';
import { Trash } from '@moondreamsdev/dreamer-ui/symbols';
import { join } from '@moondreamsdev/dreamer-ui/utils';
import type { Channel } from '@lib/mockData';

interface ChannelCardProps {
  channel: Channel;
  description?: string;
  onEdit?: (channel: Channel) => void;
  onDelete?: (channel: Channel) => void;
  onClick?: (channel: Channel) => void;
  isOwner?: boolean;
}

export function ChannelCard({
  channel,
  description,
  onEdit,
  onDelete,
  onClick,
  isOwner = false,
}: ChannelCardProps) {
  // Truncate description to first line
  const truncatedDescription = description
    ? description.split('\n')[0].length > 80
      ? description.split('\n')[0].substring(0, 80) + '...'
      : description.split('\n')[0]
    : 'No description provided';

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
              style={{ borderColor: channel.color }}
            >
              {channel.name}
            </Badge>
            {channel.isDaily && (
              <span className='text-xs text-foreground/40'>Daily</span>
            )}
          </div>
          <p className='text-sm text-foreground/70'>{truncatedDescription}</p>
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
      </div>
    </Card>
  );
}
