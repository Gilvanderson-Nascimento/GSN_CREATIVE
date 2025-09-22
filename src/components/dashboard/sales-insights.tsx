'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { generateSalesReportInsights } from '@/ai/flows/generate-sales-report-insights';
import { sales } from '@/lib/data';

export function SalesInsights() {
  const [insights, setInsights] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInsights = async () => {
    setIsLoading(true);
    setInsights('');
    try {
      const salesDataString = JSON.stringify(sales, null, 2);
      const result = await generateSalesReportInsights({ salesData: salesDataString });
      setInsights(result.insights);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsights('Ocorreu um erro ao gerar os insights. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Vendas com IA</CardTitle>
        <CardDescription>
          Clique no botão para gerar insights sobre seus dados de vendas, como produtos mais vendidos e tendências de compra.
        </CardDescription>
      </CardHeader>
      {insights && (
        <CardContent>
            <div className="prose prose-sm dark:prose-invert rounded-lg border bg-secondary/50 p-4">
                <p>{insights}</p>
            </div>
        </CardContent>
      )}
      <CardFooter>
        <Button onClick={handleGenerateInsights} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando...
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
