'use client';
import { useContext } from 'react';
import { DataContext } from '@/context/data-context';
import { useTranslation } from '@/providers/translation-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PricingHistoryTable() {
  const { priceSimulations } = useContext(DataContext);
  const { t, language, formatCurrency } = useTranslation();
  const locale = language === 'pt-BR' ? ptBR : enUS;
  const { toast } = useToast();

  const sortedSimulations = [...priceSimulations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleExport = async () => {
    if (sortedSimulations.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Nenhum dado para exportar',
        description: 'Não há simulações de preço no histórico para serem exportadas.',
      });
      return;
    }

    const { saveAs } = await import('file-saver');
    const XLSX = await import('xlsx');

    const dataToExport = sortedSimulations.map(sim => ({
      [t('pricing.date')]: format(new Date(sim.createdAt), 'P p', { locale }),
      [t('pricing.purchase_value')]: sim.purchasePrice,
      [t('pricing.tax_percent')]: sim.taxRate,
      [t('pricing.profit_margin_percent')]: sim.profitMargin,
      [t('pricing.suggested_sale_price')]: sim.suggestedSalesPrice,
    }));
    
    const fileName = `historico-precificacao-${new Date().toISOString().split('T')[0]}`;
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Histórico de Precificação");
    
    XLSX.writeFile(workbook, `${fileName}.xlsx`);

    toast({
        title: t('settings.export_complete_title'),
        description: t('settings.export_complete_description', { fileName: `${fileName}.xlsx` }),
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t('pricing.history_title')}</CardTitle>
          <CardDescription>{t('pricing.history_description')}</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport} disabled={sortedSimulations.length === 0}>
          <FileDown className="mr-2 h-4 w-4" />
          Exportar para Excel
        </Button>
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
