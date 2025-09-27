'use client';
import React, { useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataContext } from '@/context/data-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/providers/translation-provider';

export const RecentSales = React.memo(function RecentSales() {
  const { sales, customers } = useContext(DataContext);
  const { t, formatCurrency } = useTranslation();
  const recentSales = sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getCustomer = (customerId?: string) => {
    if (!customerId) return null;
    return customers.find(c => c.id === customerId);
  }

  return (
    <Card className="h-full">
      <CardHeader className="p-6">
        <CardTitle className="text-lg font-semibold">{t('dashboard.recent_sales')}</CardTitle>
        <CardDescription>{t('dashboard.total_sales_count', { count: sales.length })}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <ScrollArea className="h-[280px] -mr-6 pr-6">
            <div className="space-y-6">
            {recentSales.map((sale) => {
                const customer = getCustomer(sale.customerId);
                return (
                <div key={sale.id} className="flex items-center">
                    <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://picsum.photos/seed/${sale.customerId || 'guest'}/40/40`} alt="Avatar" data-ai-hint="person" />
                    <AvatarFallback>{customer ? customer.name.charAt(0) : 'S'}</AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                    <p className="text-sm font-semibold leading-none">{customer ? customer.name : t('dashboard.counter_sale')}</p>
                    <p className="text-xs text-muted-foreground">{customer ? customer.nickname : 'ID: ' + sale.id}</p>
                    </div>
                    <div className="ml-auto font-medium text-sm">
                    +{formatCurrency(sale.total)}
                    </div>
                </div>
                )
            })}
            {recentSales.length === 0 && (
                <div className="text-center text-sm text-muted-foreground h-full flex items-center justify-center">
                    {t('dashboard.no_recent_sales')}
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});
