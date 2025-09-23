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

export default function SettingsPage() {
  const { toast } = useToast();
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
    toast({
        variant: "destructive",
        title: "Ação Perigosa",
        description: "A funcionalidade de resetar dados ainda não foi implementada.",
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

    if (format === 'json') {
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        saveAs(blob, `backup-gsn-gestor-${new Date().toISOString().split('T')[0]}.json`);
    } else if (format === 'csv') {
        const productSheet = XLSX.utils.json_to_sheet(products);
        const customerSheet = XLSX.utils.json_to_sheet(customers);
        const salesSheet = XLSX.utils.json_to_sheet(sales.map(s => ({...s, items: JSON.stringify(s.items), customer: s.customerId || ''})));
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, productSheet, "Produtos");
        XLSX.utils.book_append_sheet(wb, customerSheet, "Clientes");
        XLSX.utils.book_append_sheet(wb, salesSheet, "Vendas");

        toast({ title: "Exportação CSV", description: "CSV é exportado como um arquivo Excel com abas separadas."})
        XLSX.writeFile(wb, `backup-csv-gsn-gestor-${new Date().toISOString().split('T')[0]}.xlsx`);

    } else if (format === 'excel') {
        const productSheet = XLSX.utils.json_to_sheet(products);
        const customerSheet = XLSX.utils.json_to_sheet(customers);
        const salesSheet = XLSX.utils.json_to_sheet(sales.map(s => ({...s, items: JSON.stringify(s.items), customer: s.customerId || ''})));
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, productSheet, "Produtos");
        XLSX.utils.book_append_sheet(wb, customerSheet, "Clientes");
        XLSX.utils.book_append_sheet(wb, salesSheet, "Vendas");
        XLSX.writeFile(wb, `backup-excel-gsn-gestor-${new Date().toISOString().split('T')[0]}.xlsx`);
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
                throw new Error("Falha ao ler o arquivo.");
            }
            const data = JSON.parse(text);
            if (data.products && data.customers && data.sales) {
                setProducts(data.products);
                setCustomers(data.customers);
                setSales(data.sales);
                toast({
                    title: "Backup Restaurado",
                    description: "Os dados foram importados com sucesso.",
                });
            } else {
                throw new Error("Formato de arquivo de backup inválido.");
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erro na Restauração",
                description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido.",
            });
        }
    };
    reader.readAsText(file);
    
    if(restoreInputRef.current) {
        restoreInputRef.current.value = '';
    }
  };


  return (
    <div>
      <PageHeader title="Configurações" />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Sistema</CardTitle>
            <CardDescription>Configurações gerais da aplicação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Empresa</label>
                <Input value={settings.sistema.nome_empresa} onChange={e => handleSettingChange('sistema', 'nome_empresa', e.target.value)} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Logo da Empresa</label>
                <Input type="file" />
            </div>
            <div className="space-y-2">
                 <label className="text-sm font-medium">Idioma</label>
                <Select value={settings.sistema.idioma} onValueChange={(v) => handleSettingChange('sistema', 'idioma', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (United States)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                 <label className="text-sm font-medium">Moeda</label>
                <Select value={settings.sistema.moeda} onValueChange={(v) => handleSettingChange('sistema', 'moeda', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="BRL">Real (BRL)</SelectItem>
                        <SelectItem value="USD">Dólar (USD)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
            <CardDescription>Personalize a aparência do sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
                <label className="text-sm font-medium">Tema</label>
                <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precificação</CardTitle>
            <CardDescription>Defina as regras de preço dos produtos.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Margem Lucro (%)</label>
                    <Input type="number" value={settings.precificacao.margem_lucro} onChange={e => handleSettingChange('precificacao', 'margem_lucro', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Imposto Padrão (%)</label>
                    <Input type="number" value={settings.precificacao.imposto_padrao} onChange={e => handleSettingChange('precificacao', 'imposto_padrao', Number(e.target.value))} />
                </div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="arredondar-valores" className="text-sm font-medium">Arredondar preços (final .99)</label>
              <Switch id="arredondar-valores" checked={settings.precificacao.arredondar_valores} onCheckedChange={(c) => handleSettingChange('precificacao', 'arredondar_valores', c)} />
            </div>
             <div className="flex items-center justify-between">
              <label htmlFor="permitir-venda-abaixo-custo" className="text-sm font-medium">Permitir venda abaixo do custo</label>
              <Switch id="permitir-venda-abaixo-custo" checked={settings.precificacao.permitir_venda_abaixo_custo} onCheckedChange={(c) => handleSettingChange('precificacao', 'permitir_venda_abaixo_custo', c)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estoque</CardTitle>
            <CardDescription>Gerencie as configurações de inventário.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between">
              <label htmlFor="notificar-estoque-minimo" className="text-sm font-medium">Notificar estoque baixo</label>
              <Switch id="notificar-estoque-minimo" checked={settings.estoque.notificar_estoque_minimo} onCheckedChange={(c) => handleSettingChange('estoque', 'notificar_estoque_minimo', c)} />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Nível mínimo de estoque</label>
                <Input type="number" value={settings.estoque.estoque_minimo_padrao} onChange={e => handleSettingChange('estoque', 'estoque_minimo_padrao', Number(e.target.value))} />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="permitir-estoque-negativo" className="text-sm font-medium">Permitir estoque negativo</label>
              <Switch id="permitir-estoque-negativo" checked={settings.estoque.permitir_estoque_negativo} onCheckedChange={(c) => handleSettingChange('estoque', 'permitir_estoque_negativo', c)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendas</CardTitle>
            <CardDescription>Configurações do ponto de venda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="venda-sem-cliente" className="text-sm font-medium">Permitir venda sem cliente</label>
              <Switch id="venda-sem-cliente" checked={settings.vendas.venda_sem_cliente} onCheckedChange={(c) => handleSettingChange('vendas', 'venda_sem_cliente', c)} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Desconto máximo permitido (%)</label>
                <Input type="number" value={settings.vendas.desconto_maximo_percentual} onChange={e => handleSettingChange('vendas', 'desconto_maximo_percentual', Number(e.target.value))} />
            </div>
             <div className="flex items-center justify-between">
              <label htmlFor="associar-vendedor" className="text-sm font-medium">Associar vendedor à venda</label>
              <Switch id="associar-vendedor" checked={settings.vendas.associar_vendedor} onCheckedChange={(c) => handleSettingChange('vendas', 'associar_vendedor', c)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários e Permissões</CardTitle>
            <CardDescription>Gerencie o acesso e as funções dos usuários.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <label htmlFor="multiusuario" className="text-sm font-medium">Sistema multiusuário</label>
                <Switch id="multiusuario" checked={settings.usuarios.multiusuario} onCheckedChange={(c) => handleSettingChange('usuarios', 'multiusuario', c)} />
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="autenticacao-2-etapas" className="text-sm font-medium">Autenticação em 2 etapas (2FA)</label>
                <Switch id="autenticacao-2-etapas" checked={settings.usuarios.autenticacao_2_etapas} onCheckedChange={(c) => handleSettingChange('usuarios', 'autenticacao_2_etapas', c)} />
            </div>
            <Separator/>
            <div>
                <h4 className="text-sm font-medium mb-2">Papéis e Permissões</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p><b>Admin:</b> Acesso total.</p>
                    <p><b>Vendedor:</b> Acesso a Vendas e Clientes.</p>
                    <p><b>Estoquista:</b> Acesso a Produtos e Estoque.</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup e Exportação</CardTitle>
            <CardDescription>Gerencie cópias de segurança e exporte seus dados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <label className="text-sm font-medium">Exportar Todos os Dados</label>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportData('csv')}>CSV</Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('excel')}>Excel</Button>
                    <Button variant="outline" size="sm" onClick={() => exportData('json')}>JSON</Button>
                </div>
            </div>
            <Separator />
             <div className="space-y-2">
                <label className="text-sm font-medium">Restaurar Backup</label>
                <Button variant="outline" className="w-full" onClick={() => restoreInputRef.current?.click()}>
                    Carregar Arquivo de Backup (.json)
                </Button>
                <input
                    type="file"
                    ref={restoreInputRef}
                    onChange={handleRestore}
                    className="hidden"
                    accept=".json"
                />
                <p className="text-xs text-muted-foreground">Carregue um arquivo JSON para restaurar todos os dados.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader>
                <CardTitle>Integrações</CardTitle>
                <CardDescription>Conecte o sistema a outros serviços.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="api-nfe" className="text-sm font-medium">API de Nota Fiscal Eletrônica</label>
                    <Switch id="api-nfe" checked={settings.integracoes.api_nfe} onCheckedChange={(c) => handleSettingChange('integracoes', 'api_nfe', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="webhooks" className="text-sm font-medium">Webhooks para desenvolvedores</label>
                    <Switch id="webhooks" checked={settings.integracoes.webhooks} onCheckedChange={(c) => handleSettingChange('integracoes', 'webhooks', c)} />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="impressora-cupom" className="text-sm font-medium">Impressora de Cupom Fiscal</label>
                    <Switch id="impressora-cupom" checked={settings.integracoes.impressora_cupom} onCheckedChange={(c) => handleSettingChange('integracoes', 'impressora_cupom', c)} />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Ambiente de Teste</CardTitle>
                <CardDescription>Opções para desenvolvedores e testes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-yellow-100/50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-md">
                    <div>
                        <label htmlFor="modo-teste" className="font-medium">Modo Teste</label>
                        <p className="text-xs text-muted-foreground">Não afeta os dados reais.</p>
                    </div>
                    <Switch id="modo-teste" checked={settings.ambiente_teste.modo_teste} onCheckedChange={(c) => handleSettingChange('ambiente_teste', 'modo_teste', c)} />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Resetar Base de Dados</label>
                    <Button variant="destructive" className="w-full" onClick={handleResetData}>Resetar Dados de Teste</Button>
                    <p className="text-xs text-muted-foreground">Atenção: Esta ação é irreversível e apagará todos os dados do ambiente de teste.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
