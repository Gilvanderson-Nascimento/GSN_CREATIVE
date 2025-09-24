'use client';
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { BackButton } from '@/components/shared/back-button';
import { useTranslation } from '@/providers/translation-provider';

const SalesHistoryTable = React.lazy(() => import('@/components/sales/sales-history-table'));

function SalesHistorySkeleton() {
    return <Skeleton className="h-[calc(100vh-10rem)]" />;
}

export default function SalesHistoryPage() {
    const { t } = useTranslation();
  return (
    <div className="space-y-6">
        <PageHeader title={t('sales.sales_history')}>
            <BackButton />
        </PageHeader>
        <Suspense fallback={<SalesHistorySkeleton />}>
            <SalesHistoryTable />
        </Suspense>
    </div>
  );
}
