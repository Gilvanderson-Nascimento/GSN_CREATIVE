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
import { useTranslation } from '@/providers/translation-provider';

const formSchema = z.object({
  name: z.string().min(2, { message: 'stock.product_form.name_min_char' }),
  category: z.string().min(2, { message: 'stock.product_form.category_min_char' }),
  quantity: z.coerce.number().min(0, { message: 'stock.product_form.quantity_not_negative' }),
  purchasePrice: z.coerce.number().positive({ message: 'stock.product_form.purchase_price_positive' }),
  salePrice: z.coerce.number().positive({ message: 'stock.product_form.sale_price_positive' }),
  barcode: z.string().min(8, { message: 'stock.product_form.barcode_invalid' }),
  imageUrl: z.string().optional(),
});

type ProductFormProps = {
  product: Product | null;
  onSave: (data: Product) => void;
  onCancel: () => void;
};

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { t } = useTranslation();
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

  const translatedMessage = (messageKey?: string) => {
    return messageKey ? t(messageKey) : undefined;
  };

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
                    <span className="text-xs text-muted-foreground text-center">{t('stock.product_form.no_image')}</span>
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
                {t('stock.product_form.upload_image')}
            </Button>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>{t('stock.product_form.product_name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('stock.product_form.ex_product_name')} {...field} />
              </FormControl>
              <FormMessage>{translatedMessage(error?.message)}</FormMessage>
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="category"
            render={({ field, fieldState: { error } }) => (
                <FormItem>
                <FormLabel>{t('stock.product_form.category')}</FormLabel>
                <FormControl>
                    <Input placeholder={t('stock.product_form.ex_category')} {...field} />
                </FormControl>
                <FormMessage>{translatedMessage(error?.message)}</FormMessage>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="quantity"
            render={({ field, fieldState: { error } }) => (
                <FormItem>
                <FormLabel>{t('stock.product_form.quantity')}</FormLabel>
                <FormControl>
                    <Input type="number" placeholder={t('stock.product_form.ex_quantity')} {...field} />
                </FormControl>
                <FormMessage>{translatedMessage(error?.message)}</FormMessage>
                </FormItem>
            )}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>{t('stock.product_form.purchase_price')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder={t('stock.product_form.ex_purchase_price')} {...field} />
                </FormControl>
                <FormMessage>{translatedMessage(error?.message)}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salePrice"
            render={({ field, fieldState: { error } }) => (
              <FormItem>
                <FormLabel>{t('stock.product_form.sale_price')}</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" placeholder={t('stock.product_form.ex_sale_price')} {...field} />
                </FormControl>
                <FormMessage>{translatedMessage(error?.message)}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="barcode"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>{t('stock.product_form.barcode')}</FormLabel>
              <FormControl>
                <Input placeholder={t('stock.product_form.ex_barcode')} {...field} />
              </FormControl>
              <FormMessage>{translatedMessage(error?.message)}</FormMessage>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('global.cancel')}
          </Button>
          <Button type="submit">{t('global.save')}</Button>
        </div>
      </form>
    </Form>
  );
}

    