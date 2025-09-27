'use client';

import React, { useContext, useRef, useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/settings/theme-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DataContext, type AppSettings } from '@/context/data-context';
import { useTranslation } from '@/providers/translation-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTheme } from 'next-themes';
import { useAuth } from '@/hooks/use-auth';
import { Label } from '@/components/ui/label';

const availableFonts = [
    { name: 'Inter', value: 'inter' },
    { name: 'Poppins', value: 'poppins' },
    { name: 'Roboto', value: 'roboto' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { products, customers, sales, setProducts, setCustomers, setSales, settings, setSettings, resetAllData } = useContext(DataContext);
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const [isResetAlertOpen, setIsResetAlertOpen] = useState(false);
  const [devPassword, setDevPassword] = useState('');
  const { user } = useAuth();
  const { setTheme } = useTheme();

  // Generic handler for nested state
  const handleSettingChange = <T extends keyof AppSettings, K extends keyof (AppSettings)[T]>(
    section: T,
    key: K,
    value: (AppSettings)[T][K]
  ) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [key]: value,
      },
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            handleSettingChange('sistema', 'logoUrl', reader.result as string);
            toast({
                title: t('settings.logo_updated_title'),
                description: t('settings.logo_updated_description'),
            });
        };
        reader.readAsDataURL(file);
    }
  }

  const handleResetAppearance = () => {
    setTheme('system');
    handleSettingChange('aparência', 'font', 'inter');
    toast({
        title: t('settings.appearance_reset_title'),
        description: t('settings.appearance_reset_description'),
    })
  }
  
  const handleConfirmResetData = async () => {
    if (user?.username !== 'GSN_CREATIVE') {
      toast({ variant: 'destructive', title: t('settings.reset_error_title'), description: t('settings.reset_permission_error') });
      return;
    }
    // Hardcoded password check for developer
    if (devPassword === 'Gsn@6437#') {
      await resetAllData();
      setIsResetAlertOpen(false);
      setDevPassword('');
      toast({
          title: t('settings.data_reset_success_title'),
          description: t('settings.data_reset_success_description'),
      });
    } else {
      toast({
        variant: 'destructive',
        title: t('settings.reset_error_title'),
        description: t('settings.reset_password_error'),
      });
    }
  }


  const exportData = async (format: 'json' | 'csv' | 'excel') => {
    const { saveAs } = await import('file-saver');
    const XLSX = await import('xlsx');

    const dataToExport = {
        products,
        customers,
        sales,
        settings, // Also backing up settings
    };
    
    const fileName = `backup-gsn-gestor-${new Date().toISOString().split('T')[0]}`;

    if (format === 'json') {
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        saveAs(blob, `${fileName}.json`);
        toast({ title: t('settings.export_complete_title'), description: t('settings.export_complete_description', { fileName: `${fileName}.json` }) });

    } else {
        const productSheet = XLSX.utils.json_to_sheet(products);
        const customerSheet = XLSX.utils.json_to_sheet(customers);
        const salesSheet = XLSX.utils.json_to_sheet(sales.map(s => ({...s, items: JSON.stringify(s.items), customer: s.customerId || ''})));
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, productSheet, t('sidebar.stock'));
        XLSX.utils.book_append_sheet(wb, customerSheet, t('sidebar.customers'));
        XLSX.utils.book_append_sheet(wb, salesSheet, t('sidebar.sales'));

        if (format === 'csv') {
            toast({ title: t('settings.csv_export_title'), description: t('settings.csv_export_note')})
        }
        
        XLSX.writeFile(wb, `${fileName}.xlsx`);
        toast({ title: t('settings.export_complete_title'), description: t('settings.export_complete_description', { fileName: `${fileName}.xlsx` }) });
    }
  }

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') {
                throw new Error(t('settings.restore_error_file_read'));
            }
            const data = JSON.parse(text);
            if (data.products && data.customers && data.sales) {
                setProducts(data.products);
                setCustomers(data.customers);
                setSales(data.sales);
                if(data.settings) setSettings(data.settings); // Restore settings
                toast({
                    title: t('settings.backup_restored_title'),
                    description: t('settings.backup_restored_description'),
                });
            } else {
                throw new Error(t('settings.restore_error_invalid_format'));
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: t('settings.restore_error_title'),
                description: error instanceof Error ? error.message : t('settings.restore_error_unknown'),
            });
        }
    };
    reader.readAsText(file);
    
    if(restoreInputRef.current) {
        restoreInputRef.current.value = '';
    }
  };


  return (
    <div className="space-y-6">
      <PageHeader title={t('settings.title')} />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.system_title')}</CardTitle>
            <CardDescription>{t('settings.system_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="company-name">{t('settings.company_name')}</Label>
                <Input id="company-name" value={settings.sistema.nome_empresa} onChange={e => handleSettingChange('sistema', 'nome_empresa', e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="company-logo">{t('settings.company_logo')}</Label>
                <Input id="company-logo" type="file" onChange={handleLogoChange} accept="image/*" />
            </div>
            <div className="space-y-2">
                 <Label htmlFor="language-select">{t('settings.language')}</Label>
                <Select value={settings.sistema.idioma} onValueChange={(v) => handleSettingChange('sistema', 'idioma', v)}>
                    <SelectTrigger id="language-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pt-BR">{t('settings.pt_br')}</SelectItem>
                        <SelectItem value="en-US">{t('settings.en_us')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                 <Label htmlFor="currency-select">{t('settings.currency')}</Label>
                <Select value={settings.sistema.moeda} onValueChange={(v) => handleSettingChange('sistema', 'moeda', v)}>
                    <SelectTrigger id="currency-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="BRL">{t('settings.brl')}</SelectItem>
                        <SelectItem value="USD">{t('settings.usd')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.appearance_title')}</CardTitle>
            <CardDescription>{t('settings.appearance_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label>{t('settings.theme')}</Label>
                <ThemeToggle />
            </div>
            <div className="space-y-2">
                <Label htmlFor="font-select">{t('settings.font')}</Label>
                <Select value={settings.aparência?.font} onValueChange={(v) => handleSettingChange('aparência', 'font', v)}>
                    <SelectTrigger id="font-select"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {availableFonts.map(font => (
                            <SelectItem key={font.value} value={font.value}>{font.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Separator />
            <Button variant="outline" className="w-full" onClick={handleResetAppearance}>{t('settings.reset_appearance')}</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.pricing_title')}</CardTitle>
            <CardDescription>{t('settings.pricing_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="profit-margin">{t('settings.profit_margin_percent')}</Label>
                    <Input id="profit-margin" type="number" value={settings.precificacao.margem_lucro} onChange={e => handleSettingChange('precificacao', 'margem_lucro', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="default-tax">{t('settings.default_tax_percent')}</Label>
                    <Input id="default-tax" type="number" value={settings.precificacao.imposto_padrao} onChange={e => handleSettingChange('precificacao', 'imposto_padrao', Number(e.target.value))} />
                </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="arredondar-valores" className="cursor-pointer">{t('settings.round_prices')}</Label>
              <Switch id="arredondar-valores" checked={settings.precificacao.arredondar_valores} onCheckedChange={(c) => handleSettingChange('precificacao', 'arredondar_valores', c)} />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="permitir-venda-abaixo-custo" className="cursor-pointer">{t('settings.allow_sale_below_cost')}</Label>
              <Switch id="permitir-venda-abaixo-custo" checked={settings.precificacao.permitir_venda_abaixo_custo} onCheckedChange={(c) => handleSettingChange('precificacao', 'permitir_venda_abaixo_custo', c)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.stock_title')}</CardTitle>
            <CardDescription>{t('settings.stock_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
              <Label htmlFor="notificar-estoque-minimo" className="cursor-pointer">{t('settings.notify_low_stock')}</Label>
              <Switch id="notificar-estoque-minimo" checked={settings.estoque.notificar_estoque_minimo} onCheckedChange={(c) => handleSettingChange('estoque', 'notificar_estoque_minimo', c)} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="min-stock">{t('settings.min_stock_level')}</Label>
                <Input id="min-stock" type="number" value={settings.estoque.estoque_minimo_padrao} onChange={e => handleSettingChange('estoque', 'estoque_minimo_padrao', Number(e.target.value))} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="permitir-estoque-negativo" className="cursor-pointer">{t('settings.allow_negative_stock')}</Label>
              <Switch id="permitir-estoque-negativo" checked={settings.estoque.permitir_estoque_negativo} onCheckedChange={(c) => handleSettingChange('estoque', 'permitir_estoque_negativo', c)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.sales_title')}</CardTitle>
            <CardDescription>{t('settings.sales_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="venda-sem-cliente" className="cursor-pointer">{t('settings.allow_sale_without_customer')}</Label>
              <Switch id="venda-sem-cliente" checked={settings.vendas.venda_sem_cliente} onCheckedChange={(c) => handleSettingChange('vendas', 'venda_sem_cliente', c)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="max-discount">{t('settings.max_discount_percent')}</Label>
                <Input id="max-discount" type="number" value={settings.vendas.desconto_maximo_percentual} onChange={e => handleSettingChange('vendas', 'desconto_maximo_percentual', Number(e.target.value))} />
            </div>
             <div className="flex items-center justify-between">
              <Label htmlFor="associar-vendedor" className="cursor-pointer">{t('settings.associate_seller')}</Label>
              <Switch id="associar-vendedor" checked={settings.vendas.associar_vendedor} onCheckedChange={(c) => handleSettingChange('vendas', 'associar_vendedor', c)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.users_permissions_title')}</CardTitle>
            <CardDescription>{t('settings.users_permissions_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="multiusuario" className="cursor-pointer">{t('settings.multi_user_system')}</Label>
                <Switch id="multiusuario" checked={settings.usuarios.multiusuario} onCheckedChange={(c) => handleSettingChange('usuarios', 'multiusuario', c)} />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="autenticacao-2-etapas" className="cursor-pointer">{t('settings.two_factor_auth')}</Label>
                <Switch id="autenticacao-2-etapas" checked={settings.usuarios.autenticacao_2_etapas} onCheckedChange={(c) => handleSettingChange('usuarios', 'autenticacao_2_etapas', c)} />
            </div>
            <Separator/>
            <div>
                <h4 className="text-sm font-medium mb-2">{t('settings.roles_permissions')}</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{t('settings.role_admin')}</p>
                    <p>{t('settings.role_seller')}</p>
                    <p>{t('settings.role_stockist')}</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('settings.backup_export_title')}</CardTitle>
            <CardDescription>{t('settings.backup_export_description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('settings.backup_frequency')}</Label>
              <Select value={settings.backup_exportacao.frequencia} onValueChange={(v) => handleSettingChange('backup_exportacao', 'frequencia', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diario">{t('settings.backup_daily')}</SelectItem>
                  <SelectItem value="semanal">{t('settings.backup_weekly')}</SelectItem>
                  <SelectItem value="mensal">{t('settings.backup_monthly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
                <Label htmlFor="backup-destination">{t('settings.backup_destination')}</Label>
                <div className="flex gap-2">
                    <Input id="backup-destination" placeholder={t('settings.backup_destination_placeholder')} />
                    <Button variant="outline">Procurar...</Button>
                </div>
            </div>
             <div className="space-y-2">
                <Label>{t('settings.export_all_data')}</Label>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportData('csv')}>CSV</Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('excel')}>Excel</Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('json')}>JSON</Button>
                </div>
            </div>
            <Separator />
             <div className="space-y-2">
                <Label>{t('settings.restore_backup')}</Label>
                <Button variant="outline" className="w-full" onClick={() => restoreInputRef.current?.click()}>
                    {t('settings.load_backup_file')}
                </Button>
                <input
                    type="file"
                    ref={restoreInputRef}
                    onChange={handleRestore}
                    className="hidden"
                    accept=".json"
                />
                <p className="text-xs text-muted-foreground">{t('settings.restore_note')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>{t('settings.integrations_title')}</CardTitle>
                <CardDescription>{t('settings.integrations_description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label htmlFor="api-nfe" className="cursor-pointer">{t('settings.einvoice_api')}</Label>
                    <Switch id="api-nfe" checked={settings.integracoes.api_nfe} onCheckedChange={(c) => handleSettingChange('integracoes', 'api_nfe', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="webhooks" className="cursor-pointer">{t('settings.developer_webhooks')}</Label>
                    <Switch id="webhooks" checked={settings.integracoes.webhooks} onCheckedChange={(c) => handleSettingChange('integracoes', 'webhooks', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <Label htmlFor="impressora-cupom" className="cursor-pointer">{t('settings.fiscal_printer')}</Label>
                    <Switch id="impressora-cupom" checked={settings.integracoes.impressora_cupom} onCheckedChange={(c) => handleSettingChange('integracoes', 'impressora_cupom', c)} />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t('settings.test_environment_title')}</CardTitle>
                <CardDescription>{t('settings.test_environment_description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-700/50 dark:text-yellow-300">
                    <div>
                        <Label htmlFor="modo-teste" className="font-medium text-sm cursor-pointer">{t('settings.test_mode')}</Label>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300/80">{t('settings.test_mode_note')}</p>
                    </div>
                    <Switch id="modo-teste" checked={settings.ambiente_teste.modo_teste} onCheckedChange={(c) => handleSettingChange('ambiente_teste', 'modo_teste', c)} />
                </div>
                 <div className="space-y-2">
                    <Label>{t('settings.reset_database')}</Label>
                    <Button variant="destructive" className="w-full" onClick={() => setIsResetAlertOpen(true)} disabled={user?.username !== 'GSN_CREATIVE'}>{t('settings.reset_all_data')}</Button>
                    <p className="text-xs text-muted-foreground">{t('settings.reset_warning')}</p>
                </div>
            </CardContent>
        </Card>
      </div>

      <AlertDialog open={isResetAlertOpen} onOpenChange={setIsResetAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('settings.delete_dialog_title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('settings.reset_password_prompt')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="dev-password" className="sr-only">{t('settings.dev_password_label')}</Label>
            <Input
                id="dev-password"
                type="password"
                placeholder={t('settings.dev_password_placeholder')}
                value={devPassword}
                onChange={(e) => setDevPassword(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setIsResetAlertOpen(false); setDevPassword(''); }}>{t('global.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmResetData} disabled={!devPassword} className="bg-destructive hover:bg-destructive/90">{t('settings.reset_all_data')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
