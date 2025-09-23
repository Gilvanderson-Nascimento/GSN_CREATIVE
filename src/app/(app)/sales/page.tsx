'use client';

import React, { Suspense } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';

const PosSystem = React.lazy(() => import('@/components/sales/pos-system'));

function PosSystemSkeleton() {
  return <Skeleton className="h-[calc(100vh-10rem)]" />;
}

export default function SalesPage() {
  return (
    <div>
      <PageHeader title="Ponto de Venda (PDV)" />
      <Suspense fallback={<PosSystemSkeleton />}>
        <PosSystem />
      </Suspense>
    </div>
  );
}
