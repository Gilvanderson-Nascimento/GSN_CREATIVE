'use client';
import { UserTable } from '@/components/users/user-table';
import { DataContext } from '@/context/data-context';
import { useContext } from 'react';
import { PageHeader } from '@/components/shared/page-header';

export default function UsersPage() {
  const { users, setUsers } = useContext(DataContext);
  // In a real app, you'd fetch this. For now, we get it from context.

  return (
    <div>
        <PageHeader title="Gerenciamento de Usuários" />
        <UserTable initialUsers={users} setUsers={setUsers} />
    </div>
  );
}
