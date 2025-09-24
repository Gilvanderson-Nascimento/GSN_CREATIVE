'use client';
import { useState, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, TrendingUp, Clock, Users } from 'lucide-react';
import { generateSalesReportInsights, type GenerateSalesReportInsightsOutput } from '@/ai/flows/generate-sales-report-insights';
import { DataContext } from '@/context/data-context';
import { ScrollArea } from '../ui/scroll-area';
import { useTranslation } from '@/providers/translation-provider';

export function SalesInsights() {
  const { sales } = useContext(DataContext);
  const { t } = useTranslation();
  const [insights, setInsights] = useState<GenerateSalesReportInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights(null);
    try {
      const salesDataString = JSON.stringify(sales.slice(0, 50), null, 2); // Limit to 50 recent sales for performance
      const result = await generateSalesReportInsights({ salesData: salesDataString });
      setInsights(result);
    } catch (error) {
      console.error('Error generating insights:', error);
      // You can add a toast notification here to inform the user about the error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col bg-white rounded-xl shadow-md">
      <CardHeader className="p-6">
        <CardTitle className="text-lg font-semibold text-gray-800">{t('dashboard.ai_sales_analysis')}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {t('dashboard.ai_sales_description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-6 pt-0">
        <ScrollArea className="h-full max-h-[280px] -mr-6 pr-6">
          {insights ? (
            <div className="space-y-4">
              <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2 p-4">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base font-semibold text-gray-800">{t('dashboard.best_selling_products')}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="text-xs font-semibold text-gray-600">{t('dashboard.product')}</TableHead>
                        <TableHead className="text-center text-xs font-semibold text-gray-600">{t('dashboard.quantity')}</TableHead>
                        <TableHead className="text-right text-xs font-semibold text-gray-600">{t('dashboard.revenue')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insights.bestSellingProducts.map(p => (
                        <TableRow key={p.name} className="text-sm border-gray-200">
                          <TableCell className="font-medium text-gray-800">{p.name}</TableCell>
                          <TableCell className="text-center text-gray-700">{p.quantity}</TableCell>
                          <TableCell className="text-right font-medium text-gray-800">R$ {p.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2 p-4">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base font-semibold text-gray-800">{t('dashboard.peak_hours')}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm p-4 pt-2 text-gray-700">
                    <p><Badge variant="secondary" className="bg-blue-100 text-blue-600">{insights.peakSalesTimes.trend}</Badge> {insights.peakSalesTimes.details}</p>
                  </CardContent>
                </Card>
                <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2 p-4">
                    <Users className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-base font-semibold text-gray-800">{t('dashboard.customer_trends')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-xs p-4 pt-2 text-gray-700">
                    {insights.customerTrends.map(c => (
                      <p key={c.customer}><strong>{c.customer}:</strong> {c.trend}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gray-50 border-dashed border-gray-300 rounded-xl">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base font-semibold text-gray-800">{t('dashboard.ai_summary')}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-sm text-gray-600">{insights.overallSummary}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <p className="text-sm text-gray-500">{t('dashboard.click_ai_button')}</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-6">
        <Button onClick={handleGenerateInsights} disabled={isLoading || sales.length === 0} size="sm" className="bg-blue-600 text-white hover:bg-blue-700 rounded-lg px-4 py-2 text-sm font-medium">
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

    