'use client';
import React from 'react';
import type { Sale, Customer, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Printer, Ban, ShoppingBasket, Pencil } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useTranslation } from '@/providers/translation-provider';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

type SaleDetailClientProps = {
  sale: Sale;
  customer?: Customer;
  seller?: User;
  onCancelSale: (saleId: string) => void;
  companyName: string;
};

export default function SaleDetailClient({ sale, customer, seller, onCancelSale, companyName }: SaleDetailClientProps) {
  const { t, language } = useTranslation();
  const locale = language === 'pt-BR' ? ptBR : enUS;

  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Recibo</title>');
      printWindow.document.write('<style>body{font-family: sans-serif; margin: 2rem;} table{width: 100%; border-collapse: collapse;} th,td{border: 1px solid #ddd; padding: 8px;} h1,h2,h3{text-align: center;} .total{font-weight: bold;}</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<h1>${companyName}</h1>`);
      printWindow.document.write(`<h2>${t('sales.receipt_title')}</h2>`);
      printWindow.document.write(`<p><strong>${t('sales.sale_id')}:</strong> ${sale.id}</p>`);
      printWindow.document.write(`<p><strong>${t('sales.date')}:</strong> ${format(new Date(sale.date), 'Pp', { locale })}</p>`);
      if(customer) printWindow.document.write(`<p><strong>${t('sales.customer')}:</strong> ${customer.name}</p>`);
      if(seller) printWindow.document.write(`<p><strong>${t('sales.seller')}:</strong> ${seller.name}</p>`);
      
      printWindow.document.write('<table><thead><tr>');
      printWindow.document.write(`<th>${t('sales.receipt_product')}</th><th>${t('sales.receipt_qty')}</th><th>${t('sales.receipt_unit_price')}</th><th>${t('sales.receipt_total')}</th>`);
      printWindow.document.write('</tr></thead><tbody>');
      sale.items.forEach(item => {
        printWindow.document.write(`<tr><td>${item.productName}</td><td>${item.quantity}</td><td>R$ ${item.unitPrice.toFixed(2)}</td><td>R$ ${item.totalPrice.toFixed(2)}</td></tr>`);
      });
      printWindow.document.write('</tbody></table>');

      printWindow.document.write(`<p><strong>${t('sales.subtotal')}:</strong> R$ ${sale.subtotal.toFixed(2)}</p>`);
      printWindow.document.write(`<p><strong>${t('sales.discount')}:</strong> ${sale.discount}%</p>`);
      printWindow.document.write(`<h3 class="total">${t('sales.total')}: R$ ${sale.total.toFixed(2)}</h3>`);

      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const isCancelled = sale.status === 'cancelled';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingBasket className="h-6 w-6"/>
                        {t('sales.items_sold')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('sales.receipt_product')}</TableHead>
                                <TableHead className="text-center">{t('sales.receipt_qty')}</TableHead>
                                <TableHead className="text-right">{t('sales.receipt_unit_price')}</TableHead>
                                <TableHead className="text-right">{t('sales.receipt_total')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sale.items.map(item => (
                                <TableRow key={item.productId}>
                                    <TableCell className="font-medium">{item.productName}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">R$ {item.unitPrice.toFixed(2)}</TableCell>
                                    <TableCell className="text-right font-medium">R$ {item.totalPrice.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('sales.sale_summary')}</CardTitle>
                    <CardDescription>{t('sales.sale_id')} {sale.id}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('sales.status')}</span>
                        <Badge variant={isCancelled ? 'destructive' : 'success'} className="capitalize">
                             {t(`sales.status_${sale.status || 'completed'}`)}
                        </Badge>
                    </div>
                     <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('sales.date')}</span>
                        <span className="font-medium">{format(new Date(sale.date), 'Pp', { locale })}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('sales.customer')}</span>
                        <span className="font-medium">{customer?.name || t('sales.counter_sale')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">{t('sales.seller')}</span>
                        <span className="font-medium">{seller?.name || '-'}</span>
                    </div>
                    <hr className="my-4"/>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('sales.subtotal')}</span>
                        <span>R$ {sale.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">{t('sales.discount')} ({sale.discount}%)</span>
                        <span>- R$ {(sale.subtotal - sale.total).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold">
                        <span>{t('sales.total')}</span>
                        <span>R$ {sale.total.toFixed(2)}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        {t('sales.generate_receipt')}
                    </Button>
                    {!isCancelled && (
                         <Button variant="outline" className="w-full" asChild>
                            <Link href={`/sales/${sale.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                {t('global.edit')}
                            </Link>
                        </Button>
                    )}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="w-full" variant="destructive" disabled={isCancelled}>
                                <Ban className="mr-2 h-4 w-4" />
                                {t('sales.cancel_sale')}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>{t('sales.cancel_sale_confirm_title')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                    {t('sales.cancel_sale_confirm_description')}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>{t('global.cancel')}</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onCancelSale(sale.id)} className="bg-destructive hover:bg-destructive/90">
                                    {t('sales.confirm_cancellation')}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
