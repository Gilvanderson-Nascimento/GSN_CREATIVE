'use client';
import { customers, sales } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/shared/page-header';
import { BackButton } from '@/components/shared/back-button';
import { CustomerDetailContent } from '@/components/customers/customer-detail-content';
import { DataContext } from '@/context/data-context';
import { useContext } from 'react';

// This function is commented out but kept for reference on how to handle static generation
// export async function generateStaticParams() {
//   // In a real app, you'd fetch this from a database
//   return customers.map((customer) => ({
//     id: customer.id,
//   }));
// }

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const { customers, sales } = useContext(DataContext);
  const customer = customers.find((c) => c.id === params.id);
  const customerSales = sales.filter((s) => s.customerId === params.id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Detalhes do Cliente">
        <BackButton />
      </PageHeader>
      <CustomerDetailContent customer={customer} sales={customerSales} />
    </div>
  );
}
