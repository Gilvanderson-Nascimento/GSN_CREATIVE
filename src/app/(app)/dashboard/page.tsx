import { sales, products, customers } from '@/lib/data';
import { PageHeader } from '@/components/shared/page-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { SalesChart } from '@/components/dashboard/sales-chart';
import { RecentSales } from '@/components/dashboard/recent-sales';
import { SalesInsights } from '@/components/dashboard/sales-insights';

export default function DashboardPage() {
  const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalProfit = sales.reduce((acc, sale) => {
    const saleProfit = sale.items.reduce((itemAcc, item) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        return itemAcc + (item.unitPrice - product.purchasePrice) * item.quantity;
      }
      return itemAcc;
    }, 0);
    return acc + saleProfit;
  }, 0);
  const newCustomers = customers.length;
  const lowStockItems = products.filter(p => p.quantity < 10).length;

  return (
    <div className="flex-1 space-y-4">
      <PageHeader title="Dashboard" />
      <div className="space-y-4">
        <StatsCards 
            totalSales={totalSales} 
            totalProfit={totalProfit}
            newCustomers={newCustomers}
            lowStockItems={lowStockItems}
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="lg:col-span-4">
            <SalesChart />
          </div>
          <div className="lg:col-span-3">
             <RecentSales />
          </div>
        </div>
        <SalesInsights />
      </div>
    </div>
  );
}
