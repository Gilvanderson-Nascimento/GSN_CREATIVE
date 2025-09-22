import { customers, sales } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/shared/page-header';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = customers.find((c) => c.id === params.id);
  const customerSales = sales.filter((s) => s.customerId === params.id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Detalhes do Cliente" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://picsum.photos/seed/${customer.id}/80/80`} alt={customer.name} data-ai-hint="person"/>
              <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{customer.name}</CardTitle>
              <p className="text-muted-foreground">{customer.nickname}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold">Contato</h4>
              <p className="text-sm text-muted-foreground">{customer.phone}</p>
            </div>
            <div>
              <h4 className="font-semibold">Endereço</h4>
              <p className="text-sm text-muted-foreground">{customer.address}</p>
            </div>
             <div className="flex gap-4 pt-4">
                <div className="text-center">
                    <p className="text-2xl font-bold">{customer.salesCount}</p>
                    <p className="text-xs text-muted-foreground">Vendas</p>
                </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold">R$ {customer.totalSpent.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Total Gasto</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID da Venda</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.items.length}</TableCell>
                    <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {customerSales.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            Nenhuma venda encontrada para este cliente.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
