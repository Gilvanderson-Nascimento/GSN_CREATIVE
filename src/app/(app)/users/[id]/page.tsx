'use client';
import { users, sales, customers } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { BackButton } from '@/components/shared/back-button';
import { UserDetailContent } from '@/components/users/user-detail-content';
import { useContext } from 'react';
import { DataContext } from '@/context/data-context';

// This function is commented out but kept for reference on how to handle static generation
// export async function generateStaticParams() {
//   // In a real app, you'd fetch this from a database
//   return users.map((user) => ({
//     id: user.id,
//   }));
// }

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const { users, sales, customers } = useContext(DataContext);
  const user = users.find((u) => u.id === params.id);
  
  if (!user) {
    notFound();
  }
  
  const userSales = sales.filter((s) => s.sellerId === params.id);

  return (
    <div>
      <PageHeader title="Detalhes do Vendedor">
        <BackButton />
      </PageHeader>
      <UserDetailContent user={user} sales={userSales} customers={customers} />
    </div>
  );
}
