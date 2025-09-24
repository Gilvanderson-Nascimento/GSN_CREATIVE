'use client';

import { useContext, useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { DataContext } from '@/context/data-context';
import { PageHeader } from '@/components/shared/page-header';
import { BackButton } from '@/components/shared/back-button';
import PosSystem from '@/components/sales/pos-system';
import { useTranslation } from '@/providers/translation-provider';
import type { Sale } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditSalePage({ params }: { params: { id: string } }) {
  const { sales, updateSale } = useContext(DataContext);
  const router = useRouter();
  const { t } = useTranslation();
  const [sale, setSale] = useState<Sale | undefined | null>(null);

  useEffect(() => {
    const saleToEdit = sales.find((s) => s.id === params.id);
    if (saleToEdit) {
      setSale(saleToEdit);
    } else {
      setSale(undefined);
    }
  }, [params.id, sales]);

  if (sale === undefined) {
    notFound();
  }

  if (sale === null) {
    return (
        <div>
            <PageHeader title={t('sales.edit_sale_title')}>
                <BackButton />
            </PageHeader>
            <Skeleton className="h-[calc(100vh-10rem)]" />
        </div>
    )
  }

  const handleUpdateSale = (updatedSaleData: {
    items: any[];
    subtotal: number;
    discount: number;
    total: number;
    customerId?: string;
  }) => {
    updateSale(params.id, updatedSaleData);
    router.push(`/sales/${params.id}`);
  };

  return (
    <div>
      <PageHeader title={`${t('sales.edit_sale_title')} ${sale.id}`}>
        <BackButton />
      </PageHeader>
      <PosSystem
        isEditing
        existingSale={sale}
        onSave={handleUpdateSale}
      />
    </div>
  );
}
