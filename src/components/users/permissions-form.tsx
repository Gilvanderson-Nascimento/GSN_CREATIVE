'use client';
import { useForm } from 'react-hook-form';
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
import { useTranslation } from '@/providers/translation-provider';

const permissionKeys = Object.keys(allPermissions) as PagePermission[];

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
  const { t } = useTranslation();
  // Ensure all possible permissions are accounted for, defaulting to false.
  const defaultPermissions = permissionKeys.reduce((acc, key) => {
    acc[key] = user.permissions?.[key] || false;
    return acc;
  }, {} as Record<PagePermission, boolean>);

  const form = useForm<PermissionsFormValues>({
    // No resolver needed, as we just need to capture the state of checkboxes.
    defaultValues: {
      permissions: defaultPermissions,
    },
  });

  function onSubmit(values: PermissionsFormValues) {
    onSave(values.permissions || {});
  }

  const getTranslatedPermission = (key: string) => {
      const translationKey = `sidebar.${key.split('_')[0]}`;
      const translation = t(translationKey as any);
      if (key.startsWith('settings_')) {
          const subKey = key.replace('settings_', '');
          return `${translation} > ${t(`settings.${subKey}_title` as any)}`;
      }
      return translation;
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
                                {getTranslatedPermission(key)}
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
            {t('global.cancel')}
          </Button>
          <Button type="submit">{t('users.save_permissions')}</Button>
        </div>
      </form>
    </Form>
  );
}
