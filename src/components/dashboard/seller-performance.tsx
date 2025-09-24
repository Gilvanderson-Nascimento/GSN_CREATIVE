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
      
    stats['unidentified'] = { id: 'unidentified', name: 'Vendedor não identificado', salesCount: 0, totalValue: 0 };


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
  }, [sales, users]);

  const totalSalesCount = useMemo(() => sales.length, [sales]);
  const totalSalesValue = useMemo(() => sales.reduce((acc, sale) => acc + sale.total, 0), [sales]);

  const activeSellers = sellerStats.filter(stat => stat.totalValue > 0 || (stat.id === 'unidentified' && stat.salesCount > 0));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
            <UserIcon className="h-5 w-5"/>
            Desempenho por Vendedor
        </CardTitle>
        <CardDescription className="text-sm">
          Análise das vendas realizadas por cada membro da equipe. Clique no nome para ver detalhes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Vendedor</TableHead>
              <TableHead className="text-center text-xs">Nº de Vendas</TableHead>
              <TableHead className="text-right text-xs">Valor Total Vendido</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeSellers.map(stat => (
              <TableRow key={stat.id} className="text-sm">
                <TableCell className="font-medium">
                  {stat.id !== 'unidentified' ? (
                     <Link href={`/users/${stat.id}`} className={cn(buttonVariants({ variant: "link" }), "p-0 h-auto text-sm")}>
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
                    <TableCell colSpan={3} className="h-24 text-center text-sm">
                        Nenhuma venda registrada no período.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
       <CardFooter className="font-semibold text-right flex justify-end gap-6 bg-muted/50 py-3">
            <div className="text-xs">
                Total Geral de Vendas: <Badge>{totalSalesCount}</Badge>
            </div>
             <div className="text-xs">
                Valor Total Geral: <span className="text-primary">R$ {totalSalesValue.toFixed(2)}</span>
            </div>
       </CardFooter>
    </Card>
  );
}
