'use client';
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductTable = React.lazy(() => import('@/components/stock/product-table'));

function ProductTableSkeleton() {
    return <Skeleton className="h-[calc(100vh-10rem)]" />;
}

export default function StockPage() {

  return (
      <Suspense fallback={<ProductTableSkeleton />}>
        <ProductTable />
      </Suspense>
  );
}
