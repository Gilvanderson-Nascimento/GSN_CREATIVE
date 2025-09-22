'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Product } from '@/lib/types';
import Image from 'next/image';
import React from 'react';
import { Upload } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  category: z.string().min(2, { message: 'Categoria deve ter pelo menos 2 caracteres.' }),
  quantity: z.coerce.number().min(0, { message: 'Quantidade não pode ser negativa.' }),
  purchasePrice: z.coerce.number().positive({ message: 'Preço de compra deve ser positivo.' }),
  salePrice: z.coerce.number().positive({ message: 'Preço de venda deve ser positivo.' }),
  barcode: z.string().min(8, { message: 'Código de barras inválido.' }),
  imageUrl: z.string().optional(),
});

type ProductFormProps = {
  product: Product | null;
  onSave: (data: Product) => void;
  onCancel: () => void;
};

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product || {
      name: '',
      category: '',
      quantity: 0,
      purchasePrice: 0,
      salePrice: 0,
      barcode: '',
      imageUrl: '',
    },
  });

  const imageUrl = form.watch('imageUrl');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };


  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({ ...values, imageUrl: values.imageUrl || '', id: product?.id || '' });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-md border border-dashed flex items-center justify-center bg-muted overflow-hidden">
                {imageUrl ? (
                    <Image 
                        src={imageUrl} 
                        alt="Preview" 
                        width={128} 
                        height={128} 
                        className="object-cover h-full w-full"
                        data-ai-hint="product image"
                    />
                ) : (
                    <span className="text-xs text-muted-foreground text-center">Sem Imagem</span>
                )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="hidden" 
              ref={fileInputRef}
            />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4" />
                Carregar Imagem
            </Button>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Arroz Parboilizado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Categoria</FormLabel>
                <FormControl>
                    <Input placeholder="Ex: Grãos" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Quantidade</FormLabel>
                <FormControl>
                    <Input type="number" placeholder="Ex: 100" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Compra</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 3.50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço de Venda</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder="Ex: 5.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código de Barras</FormLabel>
              <FormControl>
                <Input placeholder="7890123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
}
