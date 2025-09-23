'use client';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TriangleAlert, Image as ImageIcon } from 'lucide-react';
import type { Product } from '@/lib/types';
import Link from 'next/link';
import { Button } from '../ui/button';

type LowStockListProps = {
  products: Product[];
  lowStockThreshold: number;
};

export function LowStockList({ products, lowStockThreshold }: LowStockListProps) {
  const lowStockProducts = products
    .filter((p) => p.quantity <= lowStockThreshold)
    .sort((a,b) => a.quantity - b.quantity);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-2">
            <TriangleAlert className="h-6 w-6 text-destructive" />
            <CardTitle>Alerta de Estoque Baixo</CardTitle>
        </div>
        <CardDescription>
          Produtos que atingiram o nível mínimo de estoque de {lowStockThreshold} unidades.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        {lowStockProducts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[64px]">Imagem</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead className="text-right">Qtde. Restante</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lowStockProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center justify-center h-10 w-10 bg-muted rounded-md overflow-hidden">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover h-full w-full"
                          data-ai-hint="product"
                        />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={product.quantity === 0 ? "destructive" : "secondary"}>
                      {product.quantity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <p className="text-lg font-semibold">Estoque em dia!</p>
            <p className="text-sm text-muted-foreground">Nenhum produto com estoque baixo no momento.</p>
          </div>
        )}
      </CardContent>
      {lowStockProducts.length > 0 && (
          <CardFooter>
              <Button asChild variant="outline" className="w-full">
                  <Link href="/stock">Ver Estoque Completo</Link>
              </Button>
          </CardFooter>
      )}
    </Card>
  );
}
