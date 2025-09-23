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
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback><UserCog className="h-10 w-10"/></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <p className="text-muted-foreground">@{user.username}</p>
              <Badge className="mt-2 capitalize">{user.role}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex gap-4 pt-4">
                <div className="text-center">
                    <p className="text-2xl font-bold">{userSales.length}</p>
                    <p className="text-xs text-muted-foreground">Vendas Realizadas</p>
                </div>
                 <div className="text-center">
                    <p className="text-2xl font-bold">R$ {totalValueSold.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Total Vendido</p>
                </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Vendas</CardTitle>
            <CardDescription>Vendas realizadas por {user.name}.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID da Venda</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell className="font-medium">{sale.id}</TableCell>
                    <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                        {sale.customerId ? (
                            <Link href={`/customers/${sale.customerId}`} className="hover:underline">
                                {getCustomerName(sale.customerId)}
                            </Link>
                        ) : (
                            getCustomerName(sale.customerId)
                        )}
                    </TableCell>
                    <TableCell className="text-right">R$ {sale.total.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                {userSales.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">
                            Nenhuma venda encontrada para este vendedor.
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
