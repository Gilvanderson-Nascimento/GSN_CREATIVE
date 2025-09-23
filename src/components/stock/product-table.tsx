'use client';
import { useState } from 'react';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { MoreHorizontal, Pencil, PlusCircle, Trash2, Search, Image as ImageIcon } from 'lucide-react';
import { ProductForm } from './product-form';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

type ProductTableProps = {
  initialProducts: Product[];
  setProducts: (products: Product[]) => void;
};

export function ProductTable({ initialProducts, setProducts }: ProductTableProps) {
  const [filter, setFilter] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsSheetOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsSheetOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(initialProducts.filter((p) => p.id !== productId));
  };
  
  const handleSaveProduct = (productData: Product) => {
    if(editingProduct) {
        setProducts(initialProducts.map(p => p.id === productData.id ? productData : p));
    } else {
        setProducts([...initialProducts, { ...productData, id: `PROD${Date.now()}` }]);
    }
    setIsSheetOpen(false);
  }

  const filteredProducts = initialProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(filter.toLowerCase()) ||
      product.barcode.includes(filter)
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Estoque</CardTitle>
          <CardDescription>
            Visualize, adicione, edite e exclua os produtos do seu estabelecimento.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filtrar produtos por nome ou código..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={handleAddProduct}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Produto
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[80px]">Imagem</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-center">Qtde.</TableHead>
                    <TableHead className="text-right">Vl. Compra</TableHead>
                    <TableHead className="text-right">Vl. Venda</TableHead>
                    <TableHead>Cód. Barras</TableHead>
                    <TableHead>
                        <span className="sr-only">Ações</span>
                    </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map((product) => (
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
                                    data-ai-hint="product image" 
                                />
                            ) : (
                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="text-center">{product.quantity}</TableCell>
                        <TableCell className="text-right">R$ {product.purchasePrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">R$ {product.salePrice.toFixed(2)}</TableCell>
                        <TableCell>{product.barcode}</TableCell>
                        <TableCell>
                        <div className="flex justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => handleEditProduct(product)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={() => handleDeleteProduct(product.id)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" /> Excluir
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        </TableCell>
                    </TableRow>
                    ))}
                     {filteredProducts.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                Nenhum produto encontrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </CardContent>
        <CardFooter>
            <div className="text-xs text-muted-foreground">
                Mostrando <strong>{filteredProducts.length}</strong> de <strong>{initialProducts.length}</strong> produtos.
            </div>
        </CardFooter>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Produto'}</SheetTitle>
          </SheetHeader>
          <ProductForm
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => setIsSheetOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
