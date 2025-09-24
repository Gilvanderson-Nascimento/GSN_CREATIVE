'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/providers/translation-provider';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';

const PosSystem = React.lazy(() => import('@/components/sales/pos-system'));

function PosSystemSkeleton() {
  return <Skeleton className="h-[calc(100vh-10rem)]" />;
}

export default function SalesPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('sales.title')}>
        <Button asChild variant="outline" className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
            <Link href="/sales/history">
                <History className="mr-2 h-4 w-4" />
                {t('sales.sales_history')}
            </Link>
        </Button>
      </PageHeader>
      <Suspense fallback={<PosSystemSkeleton />}>
        <PosSystem />
      </Suspense>
    </div>
  );
}
