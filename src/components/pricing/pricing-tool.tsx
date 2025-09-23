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

const formSchema = z.object({
  purchasePrice: z.coerce.number().positive({ message: 'Preço de compra deve ser positivo.' }),
  taxRate: z.coerce.number().min(0, { message: 'Imposto não pode ser negativo.' }),
  profitMargin: z.coerce.number().min(0, { message: 'Margem de lucro não pode ser negativa.' }),
});

export default function PricingTool() {
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
        title: "Erro ao Sugerir Preço",
        description: "Não foi possível calcular o preço sugerido. Tente novamente.",
      });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Ferramenta de Precificação Inteligente</CardTitle>
            <CardDescription>
              Insira os custos e a margem de lucro desejada para que a IA sugira o preço de venda ideal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="purchasePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor de Compra (R$)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imposto (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profitMargin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Margem de Lucro (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {suggestedPrice !== null && (
                 <div className="flex items-center justify-center gap-4 text-center">
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Custo Total</div>
                        <div className="text-2xl font-bold">R$ {(form.getValues('purchasePrice') * (1 + form.getValues('taxRate')/100)).toFixed(2)}</div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0"/>
                     <div className="p-4 bg-primary/10 rounded-lg space-y-1">
                        <div className="text-sm text-primary font-semibold">Preço de Venda Sugerido</div>
                        <div className="text-3xl font-bold text-primary">R$ {suggestedPrice.toFixed(2)}</div>
                    </div>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Sugerir Preço de Venda
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
