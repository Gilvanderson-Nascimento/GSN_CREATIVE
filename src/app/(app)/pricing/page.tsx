'use client';

import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/page-header';
import { useTranslation } from '@/providers/translation-provider';
import { Separator } from '@/components/ui/separator';

const PricingTool = React.lazy(() => import('@/components/pricing/pricing-tool'));
const PricingHistoryTable = React.lazy(() => import('@/components/pricing/pricing-history-table'));
const StockPricingSuggestions = React.lazy(() => import('@/components/pricing/stock-pricing-suggestions'));


function PricingToolSkeleton() {
  return <Skeleton className="w-full max-w-lg h-[400px]" />;
}

function PricingHistorySkeleton() {
  return <Skeleton className="w-full h-[300px] mt-8" />;
}

export default function PricingPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-8">
       <PageHeader title={t('pricing.title')} />
       <div className="flex flex-col items-center justify-center p-4 sm:px-6 md:px-8">
            <Suspense fallback={<PricingToolSkeleton/>}>
                <PricingTool />
            </Suspense>
       </div>
       <Separator />
       <Suspense fallback={<PricingHistorySkeleton/>}>
            <StockPricingSuggestions />
       </Suspense>
       <Separator />
       <Suspense fallback={<PricingHistorySkeleton/>}>
            <PricingHistoryTable />
       </Suspense>
    </div>
  );
}
