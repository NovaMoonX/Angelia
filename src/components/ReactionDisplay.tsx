import { Button } from '@moondreamsdev/dreamer-ui/components';
import { join } from '@moondreamsdev/dreamer-ui/utils';

interface ReactionDisplayProps {
  emoji: string;
  count: number;
  isUserReacted: boolean;
  onClick: () => void;
}

export function ReactionDisplay({
  emoji,
  count,
  isUserReacted,
  onClick,
}: ReactionDisplayProps) {
  return (
    <Button
      variant={isUserReacted ? 'base' : 'outline'}
      size='sm'
      onClick={onClick}
      className={join(
        'px-3 py-1.5 gap-2 transition-all ring-2',
        isUserReacted ? 'ring-primary/30' : 'ring-transparent'
      )}
    >
      <span className='text-base' role='img' aria-label={`Reaction: ${emoji}`}>
        {emoji}
      </span>
      <span className='text-sm font-medium'>{count}</span>
    </Button>
  );
}
