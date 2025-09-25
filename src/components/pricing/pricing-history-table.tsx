'use client';
import { useContext } from 'react';
import { DataContext } from '@/context/data-context';
import { useTranslation } from '@/providers/translation-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

export default function PricingHistoryTable() {
  const { priceSimulations } = useContext(DataContext);
  const { t, language, formatCurrency } = useTranslation();
  const locale = language === 'pt-BR' ? ptBR : enUS;

  const sortedSimulations = [...priceSimulations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('pricing.history_title')}</CardTitle>
        <CardDescription>{t('pricing.history_description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border">
          <ScrollArea className="h-72">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('pricing.date')}</TableHead>
                  <TableHead className="text-right">{t('pricing.purchase_value')}</TableHead>
                  <TableHead className="text-right">{t('pricing.tax_percent')}</TableHead>
                  <TableHead className="text-right">{t('pricing.profit_margin_percent')}</TableHead>
                  <TableHead className="text-right font-medium">{t('pricing.suggested_sale_price')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedSimulations.map((sim) => (
                  <TableRow key={sim.id}>
                    <TableCell>{format(new Date(sim.createdAt), 'P p', { locale })}</TableCell>
                    <TableCell className="text-right">{formatCurrency(sim.purchasePrice)}</TableCell>
                    <TableCell className="text-right">{sim.taxRate}%</TableCell>
                    <TableCell className="text-right">{sim.profitMargin}%</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(sim.suggestedSalesPrice)}</TableCell>
                  </TableRow>
                ))}
                {sortedSimulations.length === 0 && (
                   <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            {t('pricing.no_history')}
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
