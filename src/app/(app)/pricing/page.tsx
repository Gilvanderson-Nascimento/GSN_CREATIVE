'use client';

import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PricingTool = React.lazy(() => import('@/components/pricing/pricing-tool'));

function PricingToolSkeleton() {
  return <Skeleton className="w-full max-w-lg h-[400px]" />;
}

export default function PricingPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <Suspense fallback={<PricingToolSkeleton/>}>
        <PricingTool />
      </Suspense>
    </div>
  );
}
