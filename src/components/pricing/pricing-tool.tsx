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
import { useState } from 'react';
import { Loader2, Wand2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/providers/translation-provider';

const formSchema = z.object({
  purchasePrice: z.coerce.number().positive({ message: 'pricing.purchase_price_positive' }),
  taxRate: z.coerce.number().min(0, { message: 'pricing.tax_not_negative' }),
  profitMargin: z.coerce.number().min(0, { message: 'pricing.profit_margin_not_negative' }),
});

export default function PricingTool() {
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purchasePrice: 10.00,
      taxRate: 18,
      profitMargin: 25,
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

  return (
    <Card className="w-full max-w-lg bg-white shadow-md rounded-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold text-gray-800">{t('pricing.title')}</CardTitle>
            <CardDescription className="text-base text-gray-600 mt-1">
              {t('pricing.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field, fieldState: { error } }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">{t('pricing.purchase_value')}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"/>
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
                    <FormLabel className="text-sm font-medium text-gray-700">{t('pricing.tax_percent')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"/>
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
                    <FormLabel className="text-sm font-medium text-gray-700">{t('pricing.profit_margin_percent')}</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 shadow-sm"/>
                    </FormControl>
                     <FormMessage>{translatedMessage(error?.message)}</FormMessage>
                  </FormItem>
                )}
              />
            </div>

            {suggestedPrice !== null && (
                 <div className="flex items-center justify-center gap-4 text-center">
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">{t('pricing.total_cost')}</div>
                        <div className="text-2xl font-bold text-gray-800">R$ {(form.getValues('purchasePrice') * (1 + form.getValues('taxRate')/100)).toFixed(2)}</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-gray-500 shrink-0"/>
                     <div className="p-4 bg-blue-500/10 rounded-lg space-y-1">
                        <div className="text-sm text-blue-600 font-semibold">{t('pricing.suggested_sale_price')}</div>
                        <div className="text-3xl font-bold text-blue-600">R$ {suggestedPrice.toFixed(2)}</div>
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter className="p-6">
            <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition w-full disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed">
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

    