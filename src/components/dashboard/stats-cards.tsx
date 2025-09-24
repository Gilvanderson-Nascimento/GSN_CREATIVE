import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';
import { useTranslation } from '@/providers/translation-provider';

type StatsCardsProps = {
    totalSales: number;
    totalProfit: number;
    newCustomers: number;
    lowStockItems: number;
}

export function StatsCards({ totalSales, totalProfit, newCustomers, lowStockItems }: StatsCardsProps) {
  const { t, formatCurrency } = useTranslation();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.total_sales')}</CardTitle>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold">{formatCurrency(totalSales)}</div>
          <p className="text-xs text-muted-foreground">+20.1% {t('dashboard.from_last_month')}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.profit_estimate')}</CardTitle>
          <ShoppingBag className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold">{formatCurrency(totalProfit)}</div>
          <p className="text-xs text-muted-foreground">+180.1% {t('dashboard.from_last_month')}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.new_customers')}</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold">+{newCustomers}</div>
          <p className="text-xs text-muted-foreground">+19% {t('dashboard.from_last_month')}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard.low_stock')}</CardTitle>
          <Package className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold">{lowStockItems}</div>
          <p className="text-xs text-muted-foreground">{t('dashboard.items_below_minimum')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
