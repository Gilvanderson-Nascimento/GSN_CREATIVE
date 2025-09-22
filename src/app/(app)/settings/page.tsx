'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/settings/theme-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();

  // State for all settings
  const [settings, setSettings] = useState({
    sistema: {
      nome_empresa: "Minha Empresa",
      idioma: "pt-BR",
      moeda: "BRL",
    },
    precificacao: {
      margem_lucro: 20,
      imposto_padrao: 10,
      arredondar_valores: true,
      permitir_venda_abaixo_custo: false,
    },
    estoque: {
      notificar_estoque_minimo: true,
      estoque_minimo_padrao: 5,
      permitir_estoque_negativo: false,
    },
    vendas: {
      venda_sem_cliente: true,
      desconto_maximo_percentual: 15,
      associar_vendedor: true,
    },
    usuarios: {
      multiusuario: true,
      autenticacao_2_etapas: false,
    },
    backup_exportacao: {
      frequencia: "semanal",
      permitir_importacao: true,
    },
    integracoes: {
      api_nfe: false,
      webhooks: false,
      impressora_cupom: false,
    },
    ambiente_teste: {
      modo_teste: false,
    },
  });

  // Generic handler for nested state
  const handleSettingChange = <T extends keyof typeof settings, K extends keyof (typeof settings)[T]>(
    section: T,
    key: K,
    value: (typeof settings)[T][K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleResetData = () => {
    toast({
        variant: "destructive",
        title: "Ação Perigosa",
        description: "A funcionalidade de resetar dados ainda não foi implementada.",
    })
  }

  return (
    <div>
      <PageHeader title="Configurações" />

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {/* Sistema */}
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
        
        {/* Aparência */}
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

        {/* Precificação */}
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

        {/* Estoque */}
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

        {/* Vendas */}
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

        {/* Usuários */}
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

        {/* Backup e Exportação */}
        <Card>
          <CardHeader>
            <CardTitle>Backup e Exportação</CardTitle>
            <CardDescription>Gerencie cópias de segurança e exporte seus dados.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Frequência do Backup Automático</label>
                <Select value={settings.backup_exportacao.frequencia} onValueChange={(v) => handleSettingChange('backup_exportacao', 'frequencia', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="diario">Diário</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="nunca">Nunca</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="permitir-importacao" className="text-sm font-medium">Permitir importação de dados</label>
                <Switch id="permitir-importacao" checked={settings.backup_exportacao.permitir_importacao} onCheckedChange={(c) => handleSettingChange('backup_exportacao', 'permitir_importacao', c)} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Exportar Dados</label>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">CSV</Button>
                    <Button variant="outline" size="sm">Excel</Button>
                    <Button variant="outline" size="sm">JSON</Button>
                </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Integrações */}
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

        {/* Ambiente de Teste */}
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
