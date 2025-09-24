'use client';

import type { Customer, Sale } from '@/lib/types';
import { useTranslation } from '@/providers/translation-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type CustomerDetailContentProps = {
  customer: Customer;
  sales: Sale[];
};

export function CustomerDetailContent({ customer, sales }: CustomerDetailContentProps) {
  const { t, formatCurrency } = useTranslation();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1 bg-white shadow-md rounded-xl dark:bg-card">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://picsum.photos/seed/${customer.id}/80/80`} alt={customer.name} data-ai-hint="person" />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{customer.name}</CardTitle>
            <p className="text-muted-foreground">{customer.nickname}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('customers.details.contact')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('customers.details.address')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">{customer.address}</p>
          </div>
          <div className="flex gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{customer.salesCount}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('customers.sales')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(customer.totalSpent)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('customers.details.total_spent')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-white shadow-md rounded-xl dark:bg-card">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('customers.details.sales_history')}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100 dark:bg-muted/50 dark:hover:bg-muted/50">
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-muted-foreground">{t('customers.details.sale_id')}</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-muted-foreground">{t('customers.details.date')}</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-muted-foreground">{t('customers.details.items')}</TableHead>
                  <TableHead className="text-right px-4 py-3 text-sm font-semibold text-gray-700 dark:text-muted-foreground">{t('customers.details.total')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200 dark:bg-card dark:divide-border">
                {sales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-gray-50 dark:hover:bg-muted/50">
                    <TableCell className="font-medium px-4 py-3 text-gray-800 dark:text-foreground">{sale.id}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 dark:text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 dark:text-muted-foreground">{sale.items.length}</TableCell>
                    <TableCell className="text-right px-4 py-3 text-gray-800 font-medium dark:text-foreground">{formatCurrency(sale.total)}</TableCell>
                  </TableRow>
                ))}
                {sales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-gray-500 dark:text-muted-foreground">
                      {t('customers.details.no_sales_for_customer')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
