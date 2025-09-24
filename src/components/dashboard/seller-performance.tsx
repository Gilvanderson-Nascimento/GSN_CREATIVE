'use client';
import { useMemo } from 'react';
import type { Sale, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/providers/translation-provider';

type SellerPerformanceProps = {
  sales: Sale[];
  users: User[];
};

type SellerStats = {
  id: string;
  name: string;
  salesCount: number;
  totalValue: number;
};

export function SellerPerformance({ sales, users }: SellerPerformanceProps) {
  const { t } = useTranslation();
  const sellerStats = useMemo(() => {
    const stats: Record<string, SellerStats> = {};

    users
      .filter(u => ['vendedor', 'gerente', 'admin'].includes(u.role as string))
      .forEach(user => {
        stats[user.id] = {
          id: user.id,
          name: user.name,
          salesCount: 0,
          totalValue: 0,
        };
      });
      
    stats['unidentified'] = { id: 'unidentified', name: t('dashboard.unidentified_seller'), salesCount: 0, totalValue: 0 };


    sales.forEach(sale => {
      const sellerId = sale.sellerId || 'unidentified';
      
      if (!stats[sellerId] && sale.sellerName) {
         stats[sellerId] = { id: sellerId, name: sale.sellerName, salesCount: 0, totalValue: 0 };
      }

      if (stats[sellerId]) {
        stats[sellerId].salesCount += 1;
        stats[sellerId].totalValue += sale.total;
      }
    });

    return Object.values(stats).sort((a, b) => b.totalValue - a.totalValue);
  }, [sales, users, t]);

  const totalSalesCount = useMemo(() => sales.length, [sales]);
  const totalSalesValue = useMemo(() => sales.reduce((acc, sale) => acc + sale.total, 0), [sales]);

  const activeSellers = sellerStats.filter(stat => stat.totalValue > 0 || (stat.id === 'unidentified' && stat.salesCount > 0));

  return (
    <Card>
      <CardHeader className="p-6">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <UserIcon className="h-5 w-5"/>
            {t('dashboard.seller_performance')}
        </CardTitle>
        <CardDescription>
          {t('dashboard.seller_performance_description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs text-muted-foreground font-semibold">{t('dashboard.seller')}</TableHead>
              <TableHead className="text-center text-xs text-muted-foreground font-semibold">{t('dashboard.sales_count')}</TableHead>
              <TableHead className="text-right text-xs text-muted-foreground font-semibold">{t('dashboard.total_value_sold')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeSellers.map(stat => (
              <TableRow key={stat.id} className="text-sm hover:bg-muted/50">
                <TableCell className="font-medium">
                  {stat.id !== 'unidentified' ? (
                     <Link href={`/users/${stat.id}`} className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto text-sm text-primary hover:underline")}>
                        {stat.name}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">{stat.name}</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                    <Badge variant="secondary">{stat.salesCount}</Badge>
                </TableCell>
                <TableCell className="text-right font-medium">R$ {stat.totalValue.toFixed(2)}</TableCell>
              </TableRow>
            ))}
             {activeSellers.length === 0 && (
                <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-sm text-muted-foreground">
                        {t('dashboard.no_sales_in_period')}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter className="font-semibold text-right flex justify-end gap-6 bg-muted/50 py-4 px-6">
            <div className="text-xs text-muted-foreground">
                {t('dashboard.total_general_sales')}: <Badge className="bg-primary/10 text-primary">{totalSalesCount}</Badge>
            </div>
             <div className="text-xs text-muted-foreground">
                {t('dashboard.total_general_value')}: <span className="text-primary font-bold">R$ {totalSalesValue.toFixed(2)}</span>
            </div>
       </CardFooter>
    </Card>
  );
}
