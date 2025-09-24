'use client';
import { useState, useMemo, useContext } from 'react';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreHorizontal, Search } from 'lucide-react';
import type { Sale } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataContext } from '@/context/data-context';
import { useTranslation } from '@/providers/translation-provider';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

export default function SalesHistoryTable() {
  const { sales, customers, users } = useContext(DataContext);
  const { t, language, formatCurrency } = useTranslation();
  const [filter, setFilter] = useState('');
  const locale = language === 'pt-BR' ? ptBR : enUS;

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return t('sales.counter_sale');
    return customers.find(c => c.id === customerId)?.name || t('sales.customer_not_found');
  }
  
  const getSellerName = (sellerId?: string) => {
    if(!sellerId) return '-';
    return users.find(u => u.id === sellerId)?.name || t('sales.seller_not_found');
  }

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
        const customerName = getCustomerName(sale.customerId).toLowerCase();
        const sellerName = getSellerName(sale.sellerId).toLowerCase();
        const searchTerm = filter.toLowerCase();
        return sale.id.toLowerCase().includes(searchTerm) || customerName.includes(searchTerm) || sellerName.includes(searchTerm);
    }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, filter, customers, users, t, language]);

  return (
    <>
       <Card>
        <CardHeader>
          <CardTitle>{t('sales.sales_history')}</CardTitle>
          <CardDescription>
            {t('sales.sales_history_description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('sales.filter_sales_placeholder')}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-9"
                    />
                </div>
            </div>
            <div className="rounded-xl border overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead>{t('sales.sale_id')}</TableHead>
                        <TableHead>{t('sales.date')}</TableHead>
                        <TableHead>{t('sales.customer')}</TableHead>
                        <TableHead>{t('sales.seller')}</TableHead>
                        <TableHead className="text-center">{t('sales.status')}</TableHead>
                        <TableHead className="text-right">{t('sales.total')}</TableHead>
                        <TableHead>
                            <span className="sr-only">{t('global.actions')}</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                        <TableCell className="font-medium">
                             <Link href={`/sales/${sale.id}`} className="hover:underline text-primary">
                                {sale.id}
                            </Link>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{format(new Date(sale.date), 'Pp', { locale })}</TableCell>
                        <TableCell className="text-muted-foreground">{getCustomerName(sale.customerId)}</TableCell>
                        <TableCell className="text-muted-foreground">{getSellerName(sale.sellerId)}</TableCell>
                        <TableCell className="text-center">
                            <Badge variant={sale.status === 'cancelled' ? 'destructive' : 'success'} className="capitalize">
                                {t(`sales.status_${sale.status || 'completed'}`)}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">{formatCurrency(sale.total)}</TableCell>
                        <TableCell>
                         <div className="flex justify-end">
                            <Button asChild variant="ghost" size="sm">
                                <Link href={`/sales/${sale.id}`}>
                                    <Eye className="mr-2 h-4 w-4" /> {t('global.view_details')}
                                </Link>
                            </Button>
                          </div>
                        </TableCell>
                    </TableRow>
                    ))}
                    {filteredSales.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                {t('sales.no_sales_found')}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
        <CardFooter>
            <div className="text-sm text-muted-foreground">
                {t('sales.showing_sales', { count: filteredSales.length, total: sales.length })}
            </div>
        </CardFooter>
      </Card>
    </>
  );
}
