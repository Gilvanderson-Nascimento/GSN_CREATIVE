'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { suggestOptimalPrice } from '@/ai/flows/suggest-optimal-price';
import { useState, useContext } from 'react';
import { Loader2, Wand2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/providers/translation-provider';
import { DataContext } from '@/context/data-context';

const formSchema = z.object({
  purchasePrice: z.coerce.number().positive({ message: 'pricing.purchase_price_positive' }),
  taxRate: z.coerce.number().min(0, { message: 'pricing.tax_not_negative' }),
  profitMargin: z.coerce.number().min(0, { message: 'pricing.profit_margin_not_negative' }),
});

const pricingScenarios = [
    { name: "Conservador", margin: 40 },
    { name: "Moderado", margin: 25 },
    { name: "Agressivo", margin: 15 },
]

export default function PricingTool() {
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t, formatCurrency } = useTranslation();
  const { addPriceSimulation, settings } = useContext(DataContext);
  const [activeScenario, setActiveScenario] = useState<string>("Moderado");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchasePrice: 10.00,
      taxRate: settings.precificacao.imposto_padrao,
      profitMargin: settings.precificacao.margem_lucro,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestedPrice(null);
    try {
      const result = await suggestOptimalPrice({
        ...values,
        taxRate: values.taxRate / 100,
        profitMargin: values.profitMargin / 100,
      });
      setSuggestedPrice(result.suggestedSalesPrice);
      addPriceSimulation({
        ...values,
        suggestedSalesPrice: result.suggestedSalesPrice,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: t('pricing.error_toast_title'),
        description: t('pricing.error_toast_description'),
      });
    } finally {
        setIsLoading(false);
    }
  }

  const translatedMessage = (messageKey?: string) => {
    return messageKey ? t(messageKey) : undefined;
  };

  const handleScenarioClick = (scenario: {name: string, margin: number}) => {
    form.setValue('profitMargin', scenario.margin);
    setActiveScenario(scenario.name);
  }

  return (
    <Card className="w-full max-w-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>{t('pricing.tool_title')}</CardTitle>
            <CardDescription className="mt-1">
              {t('pricing.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
                <FormLabel>Cenários Rápidos</FormLabel>
                <div className="flex gap-2">
                    {pricingScenarios.map(scenario => (
                        <Button 
                            key={scenario.name}
                            type="button"
                            variant={activeScenario === scenario.name ? "default" : "outline"}
                            onClick={() => handleScenarioClick(scenario)}
                        >
                            {scenario.name}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.purchase_value')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage>{translatedMessage(error?.message)}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.tax_percent')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                     <FormMessage>{translatedMessage(error?.message)}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profitMargin"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel>{t('pricing.profit_margin_percent')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                     <FormMessage>{translatedMessage(error?.message)}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {suggestedPrice !== null && (
                 <div className="flex items-center justify-center gap-4 text-center">
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">{t('pricing.total_cost')}</div>
                        <div className="text-2xl font-bold">{formatCurrency(form.getValues('purchasePrice') * (1 + form.getValues('taxRate')/100))}</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0"/>
                     <div className="p-4 bg-primary/10 rounded-lg space-y-1">
                        <div className="text-sm text-primary font-semibold">{t('pricing.suggested_sale_price')}</div>
                        <div className="text-3xl font-bold text-primary">{formatCurrency(suggestedPrice)}</div>
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} className="w-full mt-4">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('pricing.calculating')}
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  {t('pricing.suggest_price')}
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
