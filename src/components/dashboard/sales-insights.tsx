'use client';
import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, TrendingUp, Clock, Users } from 'lucide-react';
import { generateSalesReportInsights, type GenerateSalesReportInsightsOutput } from '@/ai/flows/generate-sales-report-insights';
import { DataContext } from '@/context/data-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/providers/translation-provider';

export function SalesInsights() {
  const { sales } = useContext(DataContext);
  const { t, formatCurrency, language } = useTranslation();
  const [insights, setInsights] = useState<GenerateSalesReportInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);
    try {
      const salesDataString = JSON.stringify(sales.slice(0, 50), null, 2); // Limit to 50 recent sales for performance
      const result = await generateSalesReportInsights({ 
          salesData: salesDataString,
          language: language === 'pt-BR' ? 'Portuguese' : 'English',
      });
      setInsights(result);
    } catch (error) {
      console.error('Error generating insights:', error);
      // You can add a toast notification here to inform the user about the error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-6">
        <CardTitle className="text-lg font-semibold">{t('dashboard.ai_sales_analysis')}</CardTitle>
        <CardDescription>
          {t('dashboard.ai_sales_description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-6 pt-0">
        <ScrollArea className="h-full max-h-[280px] -mr-6 pr-6">
          {insights ? (
            <div className="space-y-4">
              <Card>
                <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2 p-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">{t('dashboard.best_selling_products')}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs font-semibold text-muted-foreground">{t('dashboard.product')}</TableHead>
                        <TableHead className="text-center text-xs font-semibold text-muted-foreground">{t('dashboard.quantity')}</TableHead>
                        <TableHead className="text-right text-xs font-semibold text-muted-foreground">{t('dashboard.revenue')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insights.bestSellingProducts.map(p => (
                        <TableRow key={p.name} className="text-sm">
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{p.quantity}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(p.revenue)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2 p-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-semibold">{t('dashboard.peak_hours')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm p-4 pt-2 text-muted-foreground">
                    <p><Badge variant="secondary" className="bg-primary/10 text-primary">{insights.peakSalesTimes.trend}</Badge> {insights.peakSalesTimes.details}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2 p-4">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-semibold">{t('dashboard.customer_trends')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs p-4 pt-2 text-muted-foreground">
                    {insights.customerTrends.map(c => (
                      <p key={c.customer}><strong>{c.customer}:</strong> {c.trend}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-muted/50 border-dashed">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base font-semibold">{t('dashboard.ai_summary')}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-muted-foreground">{insights.overallSummary}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <p className="text-sm text-muted-foreground">{t('dashboard.click_ai_button')}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-6">
        <Button onClick={handleGenerateInsights} disabled={isLoading || sales.length === 0} size="sm">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('dashboard.analyzing')}
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              {t('dashboard.generate_insights')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
