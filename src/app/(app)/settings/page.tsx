'use client';

import React, { useContext, useRef } from 'react';
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

export default function SettingsPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const { products, customers, sales, setProducts, setCustomers, setSales, settings, setSettings } = useContext(DataContext);
  const restoreInputRef = useRef<HTMLInputElement>(null);

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

  const handleResetData = () => {
    setProducts([]);
    setCustomers([]);
    setSales([]);
    toast({
        title: t('settings.data_reset_success_title'),
        description: t('settings.data_reset_success_description'),
    })
  }

  const exportData = async (format: 'json' | 'csv' | 'excel') => {
    const { saveAs } = await import('file-saver');
    const XLSX = await import('xlsx');

    const dataToExport = {
        products,
        customers,
        sales
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
        XLSX.utils.book_append_sheet(wb, productSheet, "Produtos");
        XLSX.utils.book_append_sheet(wb, customerSheet, "Clientes");
        XLSX.utils.book_append_sheet(wb, salesSheet, "Vendas");

        if (format === 'csv') {
            toast({ title: "Exportação CSV", description: t('settings.csv_export_note')})
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
                <label className="text-sm font-medium">{t('settings.company_name')}</label>
                <Input value={settings.sistema.nome_empresa} onChange={e => handleSettingChange('sistema', 'nome_empresa', e.target.value)} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">{t('settings.company_logo')}</label>
                <Input type="file" />
            </div>
            <div className="space-y-2">
                 <label className="text-sm font-medium">{t('settings.language')}</label>
                <Select value={settings.sistema.idioma} onValueChange={(v) => handleSettingChange('sistema', 'idioma', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pt-BR">{t('settings.pt_br')}</SelectItem>
                        <SelectItem value="en-US">{t('settings.en_us')}</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                 <label className="text-sm font-medium">{t('settings.currency')}</label>
                <Select value={settings.sistema.moeda} onValueChange={(v) => handleSettingChange('sistema', 'moeda', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
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
                <label className="text-sm font-medium">{t('settings.theme')}</label>
                <ThemeToggle />
            </div>
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
                    <label className="text-sm font-medium">{t('settings.profit_margin_percent')}</label>
                    <Input type="number" value={settings.precificacao.margem_lucro} onChange={e => handleSettingChange('precificacao', 'margem_lucro', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">{t('settings.default_tax_percent')}</label>
                    <Input type="number" value={settings.precificacao.imposto_padrao} onChange={e => handleSettingChange('precificacao', 'imposto_padrao', Number(e.target.value))} />
                </div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="arredondar-valores" className="text-sm font-medium">{t('settings.round_prices')}</label>
              <Switch id="arredondar-valores" checked={settings.precificacao.arredondar_valores} onCheckedChange={(c) => handleSettingChange('precificacao', 'arredondar_valores', c)} />
            </div>
             <div className="flex items-center justify-between">
              <label htmlFor="permitir-venda-abaixo-custo" className="text-sm font-medium">{t('settings.allow_sale_below_cost')}</label>
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
              <label htmlFor="notificar-estoque-minimo" className="text-sm font-medium">{t('settings.notify_low_stock')}</label>
              <Switch id="notificar-estoque-minimo" checked={settings.estoque.notificar_estoque_minimo} onCheckedChange={(c) => handleSettingChange('estoque', 'notificar_estoque_minimo', c)} />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">{t('settings.min_stock_level')}</label>
                <Input type="number" value={settings.estoque.estoque_minimo_padrao} onChange={e => handleSettingChange('estoque', 'estoque_minimo_padrao', Number(e.target.value))} />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="permitir-estoque-negativo" className="text-sm font-medium">{t('settings.allow_negative_stock')}</label>
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
              <label htmlFor="venda-sem-cliente" className="text-sm font-medium">{t('settings.allow_sale_without_customer')}</label>
              <Switch id="venda-sem-cliente" checked={settings.vendas.venda_sem_cliente} onCheckedChange={(c) => handleSettingChange('vendas', 'venda_sem_cliente', c)} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">{t('settings.max_discount_percent')}</label>
                <Input type="number" value={settings.vendas.desconto_maximo_percentual} onChange={e => handleSettingChange('vendas', 'desconto_maximo_percentual', Number(e.target.value))} />
            </div>
             <div className="flex items-center justify-between">
              <label htmlFor="associar-vendedor" className="text-sm font-medium">{t('settings.associate_seller')}</label>
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
                <label htmlFor="multiusuario" className="text-sm font-medium">{t('settings.multi_user_system')}</label>
                <Switch id="multiusuario" checked={settings.usuarios.multiusuario} onCheckedChange={(c) => handleSettingChange('usuarios', 'multiusuario', c)} />
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="autenticacao-2-etapas" className="text-sm font-medium">{t('settings.two_factor_auth')}</label>
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
                <label className="text-sm font-medium">{t('settings.export_all_data')}</label>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportData('csv')}>CSV</Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('excel')}>Excel</Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('json')}>JSON</Button>
                </div>
            </div>
            <Separator />
             <div className="space-y-2">
                <label className="text-sm font-medium">{t('settings.restore_backup')}</label>
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
                    <label htmlFor="api-nfe" className="text-sm font-medium">{t('settings.einvoice_api')}</label>
                    <Switch id="api-nfe" checked={settings.integracoes.api_nfe} onCheckedChange={(c) => handleSettingChange('integracoes', 'api_nfe', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="webhooks" className="text-sm font-medium">{t('settings.developer_webhooks')}</label>
                    <Switch id="webhooks" checked={settings.integracoes.webhooks} onCheckedChange={(c) => handleSettingChange('integracoes', 'webhooks', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="impressora-cupom" className="text-sm font-medium">{t('settings.fiscal_printer')}</label>
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
                        <label htmlFor="modo-teste" className="font-medium text-sm">{t('settings.test_mode')}</label>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300/80">{t('settings.test_mode_note')}</p>
                    </div>
                    <Switch id="modo-teste" checked={settings.ambiente_teste.modo_teste} onCheckedChange={(c) => handleSettingChange('ambiente_teste', 'modo_teste', c)} />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">{t('settings.reset_database')}</label>
                    <Button variant="destructive" className="w-full" onClick={handleResetData}>{t('settings.reset_test_data')}</Button>
                    <p className="text-xs text-muted-foreground">{t('settings.reset_warning')}</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
