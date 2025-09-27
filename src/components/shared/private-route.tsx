'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/providers/translation-provider';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    // Don't redirect until loading is finished
    if (isLoading) return;

    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                 <Skeleton className="h-16 w-[250px]" />
                 <Skeleton className="h-8 w-[200px]" />
                 <p>{t('private_route.loading_user_data')}</p>
            </div>
        </div>
    );
  }

  // If authenticated, render the children.
  // If not authenticated, the useEffect above will have already initiated the redirect.
  // Render null or a loading spinner to prevent a flash of the protected content.
  return isAuthenticated ? <>{children}</> : null;
}
