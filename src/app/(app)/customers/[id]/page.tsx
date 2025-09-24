import { customers, sales } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/shared/page-header';
import { BackButton } from '@/components/shared/back-button';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = customers.find((c) => c.id === params.id);
  const customerSales = sales.filter((s) => s.customerId === params.id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="Detalhes do Cliente">
        <BackButton />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 bg-white shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center gap-4 p-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://picsum.photos/seed/${customer.id}/80/80`} alt={customer.name} data-ai-hint="person"/>
              <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{customer.name}</CardTitle>
              <p className="text-muted-foreground">{customer.nickname}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
            <div>
              <h4 className="font-semibold text-gray-800">Contato</h4>
              <p className="text-sm text-gray-500">{customer.phone}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Endereço</h4>
              <p className="text-sm text-gray-500">{customer.address}</p>
            </div>
             <div className="flex gap-4 pt-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{customer.salesCount}</p>
                    <p className="text-xs text-gray-500">Vendas</p>
                </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">R$ {customer.totalSpent.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Total Gasto</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white shadow-md rounded-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold text-gray-800">Histórico de Vendas</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-xl border overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100 hover:bg-gray-100">
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">ID da Venda</TableHead>
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Data</TableHead>
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Itens</TableHead>
                    <TableHead className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                    {customerSales.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium px-4 py-3 text-gray-800">{sale.id}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">{new Date(sale.date).toLocaleDateString()}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">{sale.items.length}</TableCell>
                        <TableCell className="text-right px-4 py-3 text-gray-800 font-medium">R$ {sale.total.toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                    {customerSales.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-gray-500">
                                Nenhuma venda encontrada para este cliente.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    