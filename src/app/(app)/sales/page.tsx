'use client';

import React, { Suspense } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/providers/translation-provider';

const PosSystem = React.lazy(() => import('@/components/sales/pos-system'));

function PosSystemSkeleton() {
  return <Skeleton className="h-[calc(100vh-10rem)]" />;
}

export default function SalesPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t('sales.title')} />
      <Suspense fallback={<PosSystemSkeleton />}>
        <PosSystem />
      </Suspense>
    </div>
  );
}

    