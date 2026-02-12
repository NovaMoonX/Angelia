import { Toggle } from '@moondreamsdev/dreamer-ui/components';
import { useTheme } from '@moondreamsdev/dreamer-ui/hooks';
import { Moon, Sun } from '@moondreamsdev/dreamer-ui/symbols';
import { join } from '@moondreamsdev/dreamer-ui/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className={join('flex items-center gap-2 w-fit p-3 rounded-full bg-background z-50', className)}>
      <Toggle
        checked={resolvedTheme === 'dark'}
        onClick={() => toggleTheme()}
        size='sm'
      />
      {resolvedTheme === 'dark' ? <Moon /> : <Sun />}
    </div>
  );
}
