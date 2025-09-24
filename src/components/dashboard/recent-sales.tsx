'use client';
import { useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataContext } from '@/context/data-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/providers/translation-provider';

export function RecentSales() {
  const { sales, customers } = useContext(DataContext);
  const { t } = useTranslation();
  const recentSales = sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getCustomer = (customerId?: string) => {
    if (!customerId) return null;
    return customers.find(c => c.id === customerId);
  }

  return (
    <Card className="h-full bg-white rounded-xl shadow-md">
      <CardHeader className="p-6">
        <CardTitle className="text-lg font-semibold text-gray-800">{t('dashboard.recent_sales')}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{t('dashboard.total_sales_count', { count: sales.length })}</CardDescription>
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
                    <p className="text-sm font-semibold leading-none text-gray-800">{customer ? customer.name : t('dashboard.counter_sale')}</p>
                    <p className="text-xs text-gray-500">{customer ? customer.nickname : 'ID: ' + sale.id}</p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-gray-700">
                    +R$ {sale.total.toFixed(2)}
                    </div>
                </div>
                )
            })}
            {recentSales.length === 0 && (
                <div className="text-center text-sm text-gray-500 h-full flex items-center justify-center">
                    {t('dashboard.no_recent_sales')}
                </div>
            )}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

    