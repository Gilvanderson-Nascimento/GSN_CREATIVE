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
import type { User, UserRole, PagePermission } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';

const roles: UserRole[] = ['admin', 'gerente', 'vendedor', 'estoquista'];

const baseFormSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  username: z.string().min(3, { message: 'Usuário deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: "E-mail inválido." }).optional().or(z.literal('')),
  role: z.string().min(1, { message: 'Função é obrigatória.'}),
});

type UserFormValues = Omit<User, 'id' | 'createdAt' | 'permissions'>;

type UserFormProps = {
  user: User | null;
  onSave: (data: UserFormValues) => void;
  onCancel: () => void;
};

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const { user: currentUser } = useAuth();
  
  const formSchema = baseFormSchema.extend({
      password: user
      ? z.string().optional().or(z.literal(''))
      : z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }),
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
    onSave(values);
  }

  const canEditRole = currentUser?.role === 'admin';

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: João da Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de Usuário</FormLabel>
              <FormControl>
                <Input placeholder="Ex: joao.silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail (Opcional)</FormLabel>
              <FormControl>
                <Input type="email" placeholder="joao.silva@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem>
                <FormLabel>{user ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha'}</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Função</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canEditRole}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione uma função" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {roles.map(role => (
                            <SelectItem key={role} value={role} className="capitalize">{role}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
       
        <div className="flex justify-end gap-2 pt-8">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Usuário</Button>
        </div>
      </form>
    </Form>
  );
}
