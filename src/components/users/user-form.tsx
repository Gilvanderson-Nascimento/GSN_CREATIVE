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
import { allPermissions } from '@/lib/types';
import { Separator } from '../ui/separator';
import { Checkbox } from '../ui/checkbox';
import { useAuth } from '@/hooks/use-auth';

const roles: UserRole[] = ['admin', 'gerente', 'vendedor', 'estoquista'];
const permissionKeys = Object.keys(allPermissions) as PagePermission[];

const formSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter pelo menos 2 caracteres.' }),
  username: z.string().min(3, { message: 'Usuário deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: "E-mail inválido." }).optional().or(z.literal('')),
  password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }).optional().or(z.literal('')),
  role: z.string().min(1, { message: 'Função é obrigatória.'}),
  permissions: z.record(z.boolean()).optional(),
});

type UserFormValues = Omit<User, 'id' | 'createdAt'>;

type UserFormProps = {
  user: User | null;
  onSave: (data: UserFormValues) => void;
  onCancel: () => void;
};

export function UserForm({ user, onSave, onCancel }: UserFormProps) {
  const { user: currentUser } = useAuth();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: user?.name || '',
        username: user?.username || '',
        email: user?.email || '',
        password: '', // Always empty for security
        role: user?.role || 'vendedor',
        permissions: user?.permissions || {}, // Start with no permissions for new users
    },
  });
  
  // If editing, password is not required
  if (user) {
    formSchema.shape.password = z.string().optional().or(z.literal(''));
  } else {
    formSchema.shape.password = z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' });
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave({
        ...values,
        permissions: values.permissions || {}
    });
  }

  const canEditPermissions = currentUser?.role === 'admin';

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
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!canEditPermissions}>
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

        {canEditPermissions && (
            <>
                <Separator />
                <div className="space-y-4">
                    <div>
                        <FormLabel>Permissões de Acesso</FormLabel>
                        <p className="text-sm text-muted-foreground">
                            Defina quais abas este usuário poderá visualizar.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    {permissionKeys.map((key) => (
                        <FormField
                            key={key}
                            control={form.control}
                            name={`permissions.${key}`}
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        {allPermissions[key as PagePermission]}
                                    </FormLabel>
                                </div>
                                </FormItem>
                            )}
                        />
                    ))}
                    </div>
                </div>
            </>
        )}
       
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Usuário</Button>
        </div>
      </form>
    </Form>
  );
}
