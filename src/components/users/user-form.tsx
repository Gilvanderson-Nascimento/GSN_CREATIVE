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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { User, UserRole } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/providers/translation-provider';

const roles: UserRole[] = ['admin', 'gerente', 'vendedor', 'estoquista'];

const baseFormSchema = z.object({
  name: z.string().min(2, { message: 'users.user_form.name_min_char' }),
  username: z.string().min(3, { message: 'users.user_form.username_min_char' }),
  email: z.string().email({ message: 'users.user_form.email_invalid' }).optional().or(z.literal('')),
  role: z.string().min(1, { message: 'users.user_form.role_required'}),
});

export type UserFormValues = Omit<User, 'id' | 'createdAt' | 'permissions'>;

type UserFormProps = {
  user: User | null;
  onSave: (data: UserFormValues) => void;
  onCancel: () => void;
};

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const { user: currentUser } = useAuth();
  const { t } = useTranslation();
  
  const formSchema = baseFormSchema.extend({
      password: user
      ? z.string().min(6, { message: 'users.user_form.password_min_char' }).optional().or(z.literal(''))
      : z.string().min(6, { message: 'users.user_form.password_min_char' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'vendedor',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const finalValues = {
        ...values,
        email: values.email || '',
    };
    onSave(finalValues);
  }
  
  const translatedMessage = (messageKey?: string) => {
    return messageKey ? t(messageKey) : undefined;
  };

  const canEditRole = currentUser?.username === 'GSN_CREATIVE';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>{t('users.user_form.full_name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('users.user_form.ex_full_name')} {...field} />
              </FormControl>
              <FormMessage>{translatedMessage(error?.message)}</FormMessage>
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="username"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>{t('users.user_form.username')}</FormLabel>
              <FormControl>
                <Input placeholder={t('users.user_form.ex_username')} {...field} disabled={!!user} />
              </FormControl>
              <FormMessage>{translatedMessage(error?.message)}</FormMessage>
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>{t('users.user_form.email_optional')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder={t('users.user_form.ex_email')} {...field} />
              </FormControl>
              <FormMessage>{translatedMessage(error?.message)}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState: { error } }) => (
                <FormItem>
                <FormLabel>{user ? t('users.user_form.new_password') : t('users.user_form.password')}</FormLabel>
                <FormControl>
                    <Input type="password" placeholder={t('users.user_form.password_placeholder')} {...field} />
                </FormControl>
                <FormMessage>{translatedMessage(error?.message)}</FormMessage>
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="role"
            render={({ field, fieldState: { error } }) => (
                <FormItem>
                    <FormLabel>{t('users.user_form.role')}</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canEditRole && field.value === 'admin'}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={t('users.user_form.select_role')} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {roles.map(role => (
                            <SelectItem 
                              key={role} 
                              value={role} 
                              className="capitalize"
                              disabled={role === 'admin' && !canEditRole}
                            >
                              {t(`users.roles.${role}`)}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage>{translatedMessage(error?.message)}</FormMessage>
                </FormItem>
            )}
        />
       
        <div className="flex justify-end gap-2 pt-8">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('global.cancel')}
          </Button>
          <Button type="submit">{t('global.save')}</Button>
        </div>
      </form>
    </Form>
  );
}
