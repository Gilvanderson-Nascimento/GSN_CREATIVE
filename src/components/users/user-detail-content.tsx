'use client';

import type { User, Sale, Customer } from '@/lib/types';
import { useTranslation } from '@/providers/translation-provider';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserCog } from 'lucide-react';

type UserDetailContentProps = {
  user: User;
  sales: Sale[];
  customers: Customer[];
};

export function UserDetailContent({ user, sales, customers }: UserDetailContentProps) {
  const { t, formatCurrency } = useTranslation();

  const totalValueSold = sales.reduce((acc, sale) => acc + sale.total, 0);

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return t('users.details.counter_sale');
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || t('users.details.customer_not_found');
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1 bg-white shadow-md rounded-xl dark:bg-card">
        <CardHeader className="flex flex-row items-center gap-4 p-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback><UserCog className="h-10 w-10" /></AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <p className="text-muted-foreground">@{user.username}</p>
            <Badge className="mt-2 capitalize">{user.role}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6 pt-0">
          <div className="flex gap-4 pt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{sales.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('users.details.sales_made')}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(totalValueSold)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('users.details.total_sold')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 bg-white shadow-md rounded-xl dark:bg-card">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('users.details.sales_history')}</CardTitle>
          <CardDescription className="text-base text-gray-600 dark:text-gray-300">{t('users.details.sales_by_seller', { name: user.name })}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 hover:bg-gray-100 dark:bg-muted/50 dark:hover:bg-muted/50">
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-muted-foreground">{t('users.details.sale_id')}</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-muted-foreground">{t('users.details.date')}</TableHead>
                  <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700 dark:text-muted-foreground">{t('users.details.customer')}</TableHead>
                  <TableHead className="text-right px-4 py-3 text-sm font-semibold text-gray-700 dark:text-muted-foreground">{t('users.details.total')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white divide-y divide-gray-200 dark:bg-card dark:divide-border">
                {sales.map((sale) => (
                  <TableRow key={sale.id} className="hover:bg-gray-50 dark:hover:bg-muted/50">
                    <TableCell className="font-medium px-4 py-3 text-gray-800 dark:text-foreground">{sale.id}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 dark:text-muted-foreground">{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-700 dark:text-muted-foreground">
                      {sale.customerId ? (
                        <Link href={`/customers/${sale.customerId}`} className="hover:underline text-primary">
                          {getCustomerName(sale.customerId)}
                        </Link>
                      ) : (
                        getCustomerName(sale.customerId)
                      )}
                    </TableCell>
                    <TableCell className="text-right px-4 py-3 font-medium text-gray-800 dark:text-foreground">{formatCurrency(sale.total)}</TableCell>
                  </TableRow>
                ))}
                {sales.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-gray-500 dark:text-muted-foreground">
                      {t('users.details.no_sales_for_seller')}
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
