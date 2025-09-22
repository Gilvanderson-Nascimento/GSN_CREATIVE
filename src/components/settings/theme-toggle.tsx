'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="inline-flex items-center rounded-md bg-secondary p-1">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
        className="rounded-sm"
      >
        <Sun className="h-4 w-4" />
        <span className="ml-2">Claro</span>
      </Button>
      <Button
         variant={theme === 'dark' ? 'default' : 'ghost'}
         size="sm"
         onClick={() => setTheme('dark')}
         className="rounded-sm"
      >
        <Moon className="h-4 w-4" />
         <span className="ml-2">Escuro</span>
      </Button>
       <Button
         variant={theme === 'system' ? 'default' : 'ghost'}
         size="sm"
         onClick={() => setTheme('system')}
         className="rounded-sm"
      >
        <Monitor className="h-4 w-4" />
         <span className="ml-2">Sistema</span>
      </Button>
    </div>
  );
}
