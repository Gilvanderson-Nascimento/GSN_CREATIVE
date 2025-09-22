'use client';

import React, { Suspense } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load components
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

// Mock data fetching for props - in a real app this would be in a Server Component or hook
import { sales, products, customers } from '@/lib/data';

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Skeleton className="lg:col-span-4 h-[440px]" />
            <Skeleton className="lg:col-span-3 h-[440px]" />
        </div>
    )
}

export default function DashboardPage() {

  return (
    <div className="flex-1 space-y-4">
      <PageHeader title="Dashboard" />
      <div className="space-y-4">
        <Suspense fallback={<StatsCardsSkeleton />}>
          <StatsCards 
              totalSales={totalSales} 
              totalProfit={totalProfit}
              newCustomers={newCustomers}
              lowStockItems={lowStockItems}
          />
        </Suspense>
        
        <Suspense fallback={<MainContentSkeleton />}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <SalesChart />
                </div>
                <div className="lg:col-span-3">
                    <RecentSales />
                </div>
            </div>
        </Suspense>
        
        <Suspense fallback={<Skeleton className="h-[220px]" />}>
          <SalesInsights />
        </Suspense>
      </div>
    </div>
  );
}
