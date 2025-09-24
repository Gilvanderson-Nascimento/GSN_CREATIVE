'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const router = useRouter();

  return (
    <Button variant="ghost" size="icon" onClick={() => router.back()} className="dark:text-gray-200 dark:hover:bg-gray-700">
      <ArrowLeft />
      <span className="sr-only">Voltar</span>
    </Button>
  );
}
