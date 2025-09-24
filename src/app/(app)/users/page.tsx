'use client';
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const UserTable = React.lazy(() => import('@/components/users/user-table'));

function UserTableSkeleton() {
    return <Skeleton className="h-[calc(100vh-10rem)]" />;
}

export default function UsersPage() {

  return (
    <div className="space-y-6">
        <Suspense fallback={<UserTableSkeleton />}>
            <UserTable />
        </Suspense>
    </div>
  );
}
