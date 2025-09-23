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
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { User, PagePermission } from '@/lib/types';
import { allPermissions } from '@/lib/types';

const permissionKeys = Object.keys(allPermissions) as PagePermission[];

// Updated schema to be more flexible
const formSchema = z.object({
  permissions: z.record(z.string(), z.boolean()).optional(),
});

type PermissionsFormValues = z.infer<typeof formSchema>;

type PermissionsFormProps = {
  user: User;
  onSave: (data: Partial<Record<PagePermission, boolean>>) => void;
  onCancel: () => void;
};

export function PermissionsForm({ user, onSave, onCancel }: PermissionsFormProps) {
  const form = useForm<PermissionsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      permissions: user.permissions,
    },
  });

  function onSubmit(values: PermissionsFormValues) {
    onSave(values.permissions || {});
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {permissionKeys.map((key) => (
                <FormField
                    key={key}
                    control={form.control}
                    name={`permissions.${key}`}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
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
       
        <div className="flex justify-end gap-2 pt-8">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Salvar Permissões</Button>
        </div>
      </form>
    </Form>
  );
}
