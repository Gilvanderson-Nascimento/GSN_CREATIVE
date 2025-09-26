'use client';
import { useContext, useMemo, useState } from 'react';
import { DataContext } from '@/context/data-context';
import { useTranslation } from '@/providers/translation-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Wand2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ProductWithSuggestion = Product & { suggestedPrice: number };

const pricingScenarios = [
    { name: "Conservador", margin: 40 },
    { name: "Moderado", margin: 25 },
    { name: "Agressivo", margin: 15 },
];

export default function StockPricingSuggestions() {
  const { products, setProducts, settings } = useContext(DataContext);
  const { t, formatCurrency } = useTranslation();
  const { toast } = useToast();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  
  const [profitMargin, setProfitMargin] = useState(settings.precificacao.margem_lucro);
  const [activeScenario, setActiveScenario] = useState("Moderado");


  const productsWithSuggestions = useMemo(() => {
    return products.map(product => {
      const taxRate = settings.precificacao.imposto_padrao / 100;
      const currentProfitMargin = profitMargin / 100;
      const costWithTax = product.purchasePrice * (1 + taxRate);
      const suggestedPrice = costWithTax / (1 - currentProfitMargin);
      
      let finalPrice = suggestedPrice;
      if (settings.precificacao.arredondar_valores) {
        finalPrice = Math.ceil(suggestedPrice) - 0.01;
      }

      return {
        ...product,
        suggestedPrice: finalPrice,
      };
    }).filter(p => p.suggestedPrice.toFixed(2) !== p.salePrice.toFixed(2));
  }, [products, settings.precificacao, profitMargin]);

  const handleScenarioClick = (scenario: {name: string, margin: number}) => {
    setProfitMargin(scenario.margin);
    setActiveScenario(scenario.name);
  }

  const handleApplySuggestion = (productToUpdate: ProductWithSuggestion) => {
    setProducts(
      products.map(p =>
        p.id === productToUpdate.id ? { ...p, salePrice: productToUpdate.suggestedPrice } : p
      )
    );
    toast({
      title: t('pricing.price_update_single_success_title'),
      description: t('pricing.price_update_single_success_description', { 
          productName: productToUpdate.name, 
          price: formatCurrency(productToUpdate.suggestedPrice) 
      }),
    });
  };

  const handleApplyAll = () => {
    const updatedProducts = products.map(p => {
        const suggestion = productsWithSuggestions.find(s => s.id === p.id);
        if (suggestion) {
            return { ...p, salePrice: suggestion.suggestedPrice };
        }
        return p;
    });
    setProducts(updatedProducts);
    setIsAlertOpen(false);
    toast({
        title: t('pricing.price_update_success_title'),
        description: t('pricing.price_update_success_description', { count: productsWithSuggestions.length }),
    });
  }

  return (
    <Card>
        <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
                <CardTitle>{t('pricing.stock_suggestions_title')}</CardTitle>
                <CardDescription>{t('pricing.stock_suggestions_description')}</CardDescription>
            </div>
            <div className="flex flex-col sm:items-end gap-3 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex gap-2">
                         {pricingScenarios.map(scenario => (
                            <Button 
                                key={scenario.name}
                                type="button"
                                size="sm"
                                variant={activeScenario === scenario.name ? "default" : "outline"}
                                onClick={() => handleScenarioClick(scenario)}
                            >
                                {scenario.name}
                            </Button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="batch-profit-margin" className="whitespace-nowrap text-sm">{t('pricing.profit_margin_percent')}</Label>
                        <Input
                            id="batch-profit-margin"
                            type="number"
                            value={profitMargin}
                            onChange={(e) => {
                                setProfitMargin(Number(e.target.value));
                                setActiveScenario("");
                            }}
                            className="h-9 w-24"
                        />
                    </div>
                </div>
                 <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={productsWithSuggestions.length === 0}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            {t('pricing.apply_all_suggestions')}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t('pricing.confirm_apply_all_title')}</AlertDialogTitle>
                            <AlertDialogDescription>
                            {t('pricing.confirm_apply_all_description', { count: productsWithSuggestions.length })}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t('global.cancel')}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleApplyAll}>{t('pricing.confirm_apply')}</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border">
          <ScrollArea className="h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('stock.product_name')}</TableHead>
                  <TableHead className="text-right">{t('stock.purchase_price')}</TableHead>
                  <TableHead className="text-right">{t('pricing.current_price')}</TableHead>
                  <TableHead className="text-right font-medium">{t('pricing.suggested_price')}</TableHead>
                  <TableHead className="text-center">{t('global.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productsWithSuggestions.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.purchasePrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(product.salePrice)}</TableCell>
                    <TableCell className="text-right font-medium">
                        <Badge variant="outline" className="flex items-center justify-end gap-2 border-primary text-primary">
                            <span>{formatCurrency(product.suggestedPrice)}</span>
                            <ArrowRight className="h-3 w-3"/>
                        </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                        <Button size="sm" variant="ghost" onClick={() => handleApplySuggestion(product)}>
                            <Check className="mr-2 h-4 w-4" />
                            {t('pricing.apply_suggestion')}
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {productsWithSuggestions.length === 0 && (
                   <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            {products.length > 0 ? t('pricing.no_suggestions_needed') : t('pricing.no_products_in_stock')}
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
