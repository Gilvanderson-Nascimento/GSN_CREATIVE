import { users, sales, customers } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PageHeader } from '@/components/shared/page-header';
import { BackButton } from '@/components/shared/back-button';
import { Badge } from '@/components/ui/badge';
import { UserCog } from 'lucide-react';
import Link from 'next/link';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const user = users.find((u) => u.id === params.id);
  const userSales = sales.filter((s) => s.sellerId === params.id);

  if (!user) {
    notFound();
  }
  
  const totalValueSold = userSales.reduce((acc, sale) => acc + sale.total, 0);

  const getCustomerName = (customerId?: string) => {
    if (!customerId) return 'Venda no Balcão';
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Cliente não encontrado';
  }


  return (
    <div>
      <PageHeader title="Detalhes do Vendedor">
        <BackButton />
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 bg-white shadow-md rounded-xl">
          <CardHeader className="flex flex-row items-center gap-4 p-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback><UserCog className="h-10 w-10"/></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">@{user.username}</p>
              <Badge className="mt-2 capitalize">{user.role}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 pt-0">
             <div className="flex gap-4 pt-4">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">{userSales.length}</p>
                    <p className="text-xs text-gray-500">Vendas Realizadas</p>
                </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">R$ {totalValueSold.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Total Vendido</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white shadow-md rounded-xl">
          <CardHeader className="p-6">
            <CardTitle className="text-xl font-bold text-gray-800">Histórico de Vendas</CardTitle>
            <CardDescription className="text-base text-gray-600">Vendas realizadas por {user.name}.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-xl border overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow className="bg-gray-100 hover:bg-gray-100">
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">ID da Venda</TableHead>
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Data</TableHead>
                    <TableHead className="px-4 py-3 text-sm font-semibold text-gray-700">Cliente</TableHead>
                    <TableHead className="text-right px-4 py-3 text-sm font-semibold text-gray-700">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                    {userSales.map((sale) => (
                    <TableRow key={sale.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium px-4 py-3 text-gray-800">{sale.id}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">{new Date(sale.date).toLocaleDateString()}</TableCell>
                        <TableCell className="px-4 py-3 text-gray-700">
                            {sale.customerId ? (
                                <Link href={`/customers/${sale.customerId}`} className="hover:underline text-blue-600">
                                    {getCustomerName(sale.customerId)}
                                </Link>
                            ) : (
                                getCustomerName(sale.customerId)
                            )}
                        </TableCell>
                        <TableCell className="text-right px-4 py-3 font-medium text-gray-800">R$ {sale.total.toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                    {userSales.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center h-24 text-gray-500">
                                Nenhuma venda encontrada para este vendedor.
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
