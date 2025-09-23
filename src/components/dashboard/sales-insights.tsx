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

export function SalesInsights() {
  const { sales } = useContext(DataContext);
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
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Análise de Vendas com IA</CardTitle>
        <CardDescription>
          Clique no botão para gerar insights sobre seus dados de vendas, como produtos mais vendidos e tendências de compra.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          {insights ? (
            <div className="space-y-4 pr-4">
              <Card>
                <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-semibold">Produtos Mais Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-center">Qtde.</TableHead>
                        <TableHead className="text-right">Receita</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insights.bestSellingProducts.map(p => (
                        <TableRow key={p.name}>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className="text-center">{p.quantity}</TableCell>
                          <TableCell className="text-right">R$ {p.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-semibold">Horários de Pico</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm pt-4">
                    <p><Badge variant="secondary">{insights.peakSalesTimes.trend}</Badge> {insights.peakSalesTimes.details}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex-row items-center gap-2 space-y-0 pb-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base font-semibold">Tendências dos Clientes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm pt-4">
                    {insights.customerTrends.map(c => (
                      <p key={c.customer}><strong>{c.customer}:</strong> {c.trend}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-secondary/50 border-dashed">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">Resumo Geral da IA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{insights.overallSummary}</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <p className="text-muted-foreground">Clique no botão abaixo para usar a IA.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button onClick={handleGenerateInsights} disabled={isLoading || sales.length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analisando Dados...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Gerar Insights
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
