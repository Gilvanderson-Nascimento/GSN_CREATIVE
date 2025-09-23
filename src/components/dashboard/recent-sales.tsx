'use client';
import { useContext } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataContext } from '@/context/data-context';

export function RecentSales() {
  const { sales, customers } = useContext(DataContext);
  const recentSales = sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const getCustomer = (customerId?: string) => {
    if (!customerId) return null;
    return customers.find(c => c.id === customerId);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
        <CardDescription>Você fez {sales.length} vendas no total.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentSales.map((sale) => {
            const customer = getCustomer(sale.customerId);
            return (
              <div key={sale.id} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://picsum.photos/seed/${sale.customerId || 'guest'}/40/40`} alt="Avatar" data-ai-hint="person" />
                  <AvatarFallback>{customer ? customer.name.charAt(0) : 'S'}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{customer ? customer.name : 'Venda no balcão'}</p>
                  <p className="text-sm text-muted-foreground">{customer ? customer.nickname : 'ID: ' + sale.id}</p>
                </div>
                <div className="ml-auto font-medium">
                  +R${sale.total.toFixed(2)}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  );
}
