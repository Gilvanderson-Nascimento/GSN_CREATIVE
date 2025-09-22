'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue 
} from '@/components/ui/select';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-full rounded-md border bg-background" />;
  }

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione um tema" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Claro</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
           <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Escuro</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
           <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Sistema</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
