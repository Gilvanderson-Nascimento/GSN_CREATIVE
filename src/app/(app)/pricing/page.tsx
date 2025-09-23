'use client';

import React, { Suspense } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';

const PricingTool = React.lazy(() => import('@/components/pricing/pricing-tool'));

function PricingToolSkeleton() {
  return <Skeleton className="max-w-2xl h-[400px]" />;
}

export default function PricingPage() {
  return (
    <div>
      <PageHeader title="Precificação Inteligente" />
      <Suspense fallback={<PricingToolSkeleton/>}>
        <PricingTool />
      </Suspense>
    </div>
  );
}
