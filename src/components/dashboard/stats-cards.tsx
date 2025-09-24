import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, ShoppingBag, Users } from 'lucide-react';

type StatsCardsProps = {
    totalSales: number;
    totalProfit: number;
    newCustomers: number;
    lowStockItems: number;
}

export function StatsCards({ totalSales, totalProfit, newCustomers, lowStockItems }: StatsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-gray-500">Total de Vendas</CardTitle>
          <DollarSign className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold text-gray-800">R$ {totalSales.toFixed(2)}</div>
          <p className="text-xs text-gray-500">+20.1% do último mês</p>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-gray-500">Lucro (Estimado)</CardTitle>
          <ShoppingBag className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold text-gray-800">R$ {totalProfit.toFixed(2)}</div>
          <p className="text-xs text-gray-500">+180.1% do último mês</p>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-gray-500">Novos Clientes</CardTitle>
          <Users className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold text-gray-800">+{newCustomers}</div>
          <p className="text-xs text-gray-500">+19% do último mês</p>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-xl shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-sm font-medium text-gray-500">Baixo Estoque</CardTitle>
          <Package className="h-5 w-5 text-gray-400" />
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="text-2xl font-bold text-gray-800">{lowStockItems}</div>
          <p className="text-xs text-gray-500">Itens abaixo do nível mínimo</p>
        </CardContent>
      </Card>
    </div>
  );
}
