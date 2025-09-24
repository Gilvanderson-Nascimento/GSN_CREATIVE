'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TriangleAlert, Image as ImageIcon } from 'lucide-react';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { useTranslation } from '@/providers/translation-provider';

type LowStockListProps = {
  products: Product[];
  lowStockThreshold: number;
};

export function LowStockList({ products, lowStockThreshold }: LowStockListProps) {
  const { t } = useTranslation();
  const lowStockProducts = products
    .filter((p) => p.quantity <= lowStockThreshold)
    .sort((a,b) => a.quantity - b.quantity);

  return (
    <Card className="h-full flex flex-col bg-red-50 border border-red-200 text-red-600 rounded-xl shadow-sm">
      <CardHeader className="p-6">
        <div className="flex items-center gap-2">
            <TriangleAlert className="h-6 w-6 text-red-500" />
            <CardTitle className="text-lg font-semibold text-gray-800">{t('dashboard.low_stock_alert')}</CardTitle>
        </div>
        <CardDescription className="text-sm text-red-500">
          {t('dashboard.low_stock_description', { count: lowStockThreshold })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-6 pt-0">
        <ScrollArea className="h-full max-h-[280px]">
            {lowStockProducts.length > 0 ? (
            <Table>
                <TableHeader>
                <TableRow className="border-red-200">
                    <TableHead className="w-[64px] text-xs font-semibold text-gray-600">{t('dashboard.image')}</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-600">{t('dashboard.product')}</TableHead>
                    <TableHead className="text-right text-xs font-semibold text-gray-600">{t('dashboard.remaining_qty')}</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {lowStockProducts.map((product) => (
                    <TableRow key={product.id} className="text-sm border-red-200">
                    <TableCell>
                        <div className="flex items-center justify-center h-10 w-10 bg-white rounded-lg overflow-hidden border border-gray-200">
                        {product.imageUrl ? (
                            <Image
                            src={product.imageUrl}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover h-full w-full"
                            data-ai-hint="product"
                            />
                        ) : (
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                        )}
                        </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">{product.name}</TableCell>
                    <TableCell className="text-right">
                        <Badge variant={product.quantity === 0 ? "destructive" : "secondary"} className="bg-red-100 text-red-600">
                        {product.quantity}
                        </Badge>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <p className="text-lg font-semibold text-gray-800">{t('dashboard.stock_ok')}</p>
                <p className="text-sm text-gray-500">{t('dashboard.no_low_stock_products')}</p>
            </div>
            )}
        </ScrollArea>
      </CardContent>
      {lowStockProducts.length > 0 && (
          <CardFooter className="p-6 pt-0">
              <Button asChild variant="outline" size="sm" className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg px-4 py-2 text-sm font-medium">
                  <Link href="/stock">{t('dashboard.view_full_stock')}</Link>
              </Button>
          </CardFooter>
      )}
    </Card>
  );
}

    