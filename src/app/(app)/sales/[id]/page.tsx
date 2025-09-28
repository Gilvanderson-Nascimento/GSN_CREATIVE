'use client';
import React, { useContext } from 'react';
import { notFound } from 'next/navigation';
import { DataContext } from '@/context/data-context';
import { PageHeader } from '@/components/shared/page-header';
import { BackButton } from '@/components/shared/back-button';
import { useTranslation } from '@/providers/translation-provider';
import SaleDetailClient from '@/components/sales/sale-detail';

// This function is commented out but kept for reference on how to handle static generation
// export async function generateStaticParams() {
//   // In a real app, you'd fetch this from a database
//   // For now, we'll assume no sales can be viewed statically this way.
//   return [];
// }

export default function SaleDetailPage({ params }: { params: { id: string } }) {
  const { sales, customers, users, cancelSale, settings } = useContext(DataContext);
  const { t } = useTranslation();
  
  const sale = sales.find((s) => s.id === params.id);
  
  if (!sale) {
    notFound();
  }

  const customer = customers.find(c => c.id === sale.customerId);
  const seller = users.find(u => u.id === sale.sellerId);

  return (
    <div>
        <PageHeader title={`${t('sales.sale_detail_title')} ${sale.id}`}>
            <BackButton />
        </PageHeader>
        <SaleDetailClient 
            sale={sale}
            customer={customer}
            seller={seller}
            onCancelSale={cancelSale}
            companyName={settings.sistema.nome_empresa}
        />
    </div>
  );
}
