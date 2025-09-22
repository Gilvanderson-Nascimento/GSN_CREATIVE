
import { PageHeader } from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/settings/theme-toggle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
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
                <Input defaultValue="Minha Empresa" />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Logo da Empresa</label>
                <Input type="file" />
            </div>
            <div className="space-y-2">
                 <label className="text-sm font-medium">Idioma</label>
                <Select defaultValue="pt-BR">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (United States)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                 <label className="text-sm font-medium">Moeda</label>
                <Select defaultValue="BRL">
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
            <div className="flex items-center justify-between">
                <span className="font-medium">Tema</span>
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
                    <Input type="number" defaultValue={20} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Imposto Padrão (%)</label>
                    <Input type="number" defaultValue={10} />
                </div>
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="arredondar-valores" className="text-sm font-medium">Arredondar preços (final .99)</label>
              <Switch id="arredondar-valores" defaultChecked />
            </div>
             <div className="flex items-center justify-between">
              <label htmlFor="permitir-venda-abaixo-custo" className="text-sm font-medium">Permitir venda abaixo do custo</label>
              <Switch id="permitir-venda-abaixo-custo" />
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
              <Switch id="notificar-estoque-minimo" defaultChecked />
            </div>
             <div className="space-y-2">
                <label className="text-sm font-medium">Nível mínimo de estoque</label>
                <Input type="number" defaultValue={5} />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="permitir-estoque-negativo" className="text-sm font-medium">Permitir estoque negativo</label>
              <Switch id="permitir-estoque-negativo" />
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
              <Switch id="venda-sem-cliente" defaultChecked />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Desconto máximo permitido (%)</label>
                <Input type="number" defaultValue={15} />
            </div>
             <div className="flex items-center justify-between">
              <label htmlFor="associar-vendedor" className="text-sm font-medium">Associar vendedor à venda</label>
              <Switch id="associar-vendedor" defaultChecked />
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
                <Switch id="multiusuario" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="autenticacao-2-etapas" className="text-sm font-medium">Autenticação em 2 etapas (2FA)</label>
                <Switch id="autenticacao-2-etapas" />
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
                <Select defaultValue="semanal">
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
                <Switch id="permitir-importacao" defaultChecked />
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
                    <Switch id="api-nfe" />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="webhooks" className="text-sm font-medium">Webhooks para desenvolvedores</label>
                    <Switch id="webhooks" />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="impressora-cupom" className="text-sm font-medium">Impressora de Cupom Fiscal</label>
                    <Switch id="impressora-cupom" />
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
                    <Switch id="modo-teste" />
                </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium">Resetar Base de Dados</label>
                    <Button variant="destructive" className="w-full">Resetar Dados de Teste</Button>
                    <p className="text-xs text-muted-foreground">Atenção: Esta ação é irreversível e apagará todos os dados do ambiente de teste.</p>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

    