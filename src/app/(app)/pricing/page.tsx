'use client';

import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PricingTool = React.lazy(() => import('@/components/pricing/pricing-tool'));

function PricingToolSkeleton() {
  return <Skeleton className="w-full max-w-lg h-[400px]" />;
}

export default function PricingPage() {
  return (
    <div className="flex items-center justify-center p-4 sm:px-6 md:px-8">
      <Suspense fallback={<PricingToolSkeleton/>}>
        <PricingTool />
      </Suspense>
    </div>
  );
}

    