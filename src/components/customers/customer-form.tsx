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
import type { Customer } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/providers/translation-provider';

const formSchema = z.object({
  name: z.string().min(2, { message: 'customers.customer_form.name_min_char' }),
  nickname: z.string().optional(),
  phone: z.string().min(8, { message: 'customers.customer_form.phone_invalid' }),
  address: z.string().optional(),
});

type CustomerFormValues = Omit<Customer, 'id' | 'salesCount' | 'totalSpent'>;

type CustomerFormProps = {
  customer: Customer | null;
  onSave: (data: CustomerFormValues) => void;
  onCancel: () => void;
};

export function CustomerForm({ customer, onSave, onCancel }: CustomerFormProps) {
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: customer?.name || '',
        nickname: customer?.nickname || '',
        phone: customer?.phone || '',
        address: customer?.address || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
        ...values,
        nickname: values.nickname || '',
        address: values.address || '',
    });
  }

  // Custom message handler to translate error messages
  const translatedMessage = (messageKey?: string) => {
    return messageKey ? t(messageKey) : undefined;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>{t('customers.customer_form.full_name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('customers.customer_form.ex_full_name')} {...field} />
              </FormControl>
              <FormMessage>{translatedMessage(error?.message)}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customers.customer_form.nickname_optional')}</FormLabel>
              <FormControl>
                <Input placeholder={t('customers.customer_form.ex_nickname')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="phone"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>{t('customers.customer_form.phone')}</FormLabel>
              <FormControl>
                <Input placeholder={t('customers.customer_form.ex_phone')} {...field} />
              </FormControl>
              <FormMessage>{translatedMessage(error?.message)}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('customers.customer_form.address_optional')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('customers.customer_form.ex_address')} {...field} />
              </FormControl>
              <FormMessage />
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

    