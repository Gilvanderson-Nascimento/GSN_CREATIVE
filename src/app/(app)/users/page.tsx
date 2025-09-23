'use client';
import React, { Suspense } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';

const UserTable = React.lazy(() => import('@/components/users/user-table'));

function UserTableSkeleton() {
    return <Skeleton className="h-[calc(100vh-10rem)]" />;
}

export default function UsersPage() {

  return (
    <div>
        <PageHeader title="Gerenciamento de Usuários" />
        <Suspense fallback={<UserTableSkeleton />}>
            <UserTable />
        </Suspense>
    </div>
  );
}
