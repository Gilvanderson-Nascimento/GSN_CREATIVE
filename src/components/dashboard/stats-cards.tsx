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
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.total_sales')}</CardTitle>
          <DollarSign className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold text-gray-800">R$ {totalSales.toFixed(2)}</div>
          <p className="text-xs text-gray-500">+20.1% {t('dashboard.from_last_month')}</p>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.profit_estimate')}</CardTitle>
          <ShoppingBag className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold text-gray-800">R$ {totalProfit.toFixed(2)}</div>
          <p className="text-xs text-gray-500">+180.1% {t('dashboard.from_last_month')}</p>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.new_customers')}</CardTitle>
          <Users className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold text-gray-800">+{newCustomers}</div>
          <p className="text-xs text-gray-500">+19% {t('dashboard.from_last_month')}</p>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-gray-500">{t('dashboard.low_stock')}</CardTitle>
          <Package className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold text-gray-800">{lowStockItems}</div>
          <p className="text-xs text-gray-500">{t('dashboard.items_below_minimum')}</p>
        </CardContent>
      </Card>
    </div>
  );
}

    