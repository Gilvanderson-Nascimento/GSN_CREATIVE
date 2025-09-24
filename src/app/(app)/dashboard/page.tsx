'use client';

import React, { Suspense, useContext } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DataContext } from '@/context/data-context';

const StatsCards = React.lazy(() => 
  import('@/components/dashboard/stats-cards').then(module => ({ default: module.StatsCards }))
);
const SalesChart = React.lazy(() => 
  import('@/components/dashboard/sales-chart').then(module => ({ default: module.SalesChart }))
);
const RecentSales = React.lazy(() => 
  import('@/components/dashboard/recent-sales').then(module => ({ default: module.RecentSales }))
);
const SalesInsights = React.lazy(() => 
  import('@/components/dashboard/sales-insights').then(module => ({ default: module.SalesInsights }))
);
const LowStockList = React.lazy(() =>
  import('@/components/dashboard/low-stock-list').then(module => ({ default: module.LowStockList }))
);
const SellerPerformance = React.lazy(() =>
  import('@/components/dashboard/seller-performance').then(module => ({ default: module.SellerPerformance }))
);


function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-[126px]" />
      <Skeleton className="h-[126px]" />
      <Skeleton className="h-[126px]" />
      <Skeleton className="h-[126px]" />
    </div>
  );
}

function MainContentSkeleton() {
    return (
        <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-3">
            <Skeleton className="xl:col-span-2 h-[350px]" />
            <Skeleton className="h-[350px]" />
        </div>
    )
}

export default function DashboardPage() {
  const { sales, products, customers, settings, users } = useContext(DataContext);
  const lowStockThreshold = settings.estoque.estoque_minimo_padrao;

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
  const lowStockItemsCount = products.filter(p => p.quantity < lowStockThreshold).length;

  return (
    <div className="flex-1 space-y-4">
      <PageHeader title="Dashboard" />
      <div className="space-y-6">
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards 
              totalSales={totalSales} 
              totalProfit={totalProfit}
              newCustomers={newCustomers}
              lowStockItems={lowStockItemsCount}
          />
        </Suspense>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
                <Suspense fallback={<Skeleton className="h-[350px]" />}>
                    <SalesChart />
                </Suspense>
            </div>
            <div className="lg:col-span-1">
                <Suspense fallback={<Skeleton className="h-[350px]" />}>
                    <RecentSales />
                </Suspense>
            </div>
        </div>
        
         <Suspense fallback={<Skeleton className="h-[320px]" />}>
            <SellerPerformance sales={sales} users={users} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            <div className="lg:col-span-4">
                <Suspense fallback={<Skeleton className="h-[400px]" />}>
                    <SalesInsights />
                </Suspense>
            </div>
            <div className="lg:col-span-3">
                 <Suspense fallback={<Skeleton className="h-[400px]" />}>
                    <LowStockList 
                        products={products}
                        lowStockThreshold={lowStockThreshold} 
                    />
                </Suspense>
            </div>
        </div>
      </div>
    </div>
  );
}
