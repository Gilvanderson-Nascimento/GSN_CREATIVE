'use client';
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CustomerTable = React.lazy(() => import('@/components/customers/customer-table'));

function CustomerTableSkeleton() {
    return <Skeleton className="h-[calc(100vh-10rem)]" />;
}

export default function CustomersPage() {

  return (
    <Suspense fallback={<CustomerTableSkeleton />}>
      <CustomerTable />
    </Suspense>
  );
}
