import { users, sales, customers } from '@/lib/data';
import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { BackButton } from '@/components/shared/back-button';
import { UserDetailContent } from '@/components/users/user-detail-content';

export default function UserDetailPage({ params }: { params: { id: string } }) {
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
