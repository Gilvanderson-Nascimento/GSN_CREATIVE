import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sales } from '@/lib/data';

export function RecentSales() {
  const recentSales = sales.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendas Recentes</CardTitle>
        <CardDescription>Você fez {sales.length} vendas este mês.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentSales.map((sale) => (
            <div key={sale.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                 <AvatarImage src={`https://picsum.photos/seed/${sale.customerId || 'guest'}/40/40`} alt="Avatar" data-ai-hint="person" />
                <AvatarFallback>{sale.customer ? sale.customer.name.charAt(0) : 'S'}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{sale.customer ? sale.customer.name : 'Venda no balcão'}</p>
                <p className="text-sm text-muted-foreground">{sale.customer ? sale.customer.nickname : 'ID: ' + sale.id}</p>
              </div>
              <div className="ml-auto font-medium">
                +R${sale.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
