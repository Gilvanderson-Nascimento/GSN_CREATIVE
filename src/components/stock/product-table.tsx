'use client';
import { useState, useMemo, useContext } from 'react';
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
import { MoreHorizontal, Pencil, PlusCircle, Trash2, Search, Image as ImageIcon, TriangleAlert } from 'lucide-react';
import { ProductForm } from './product-form';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataContext } from '@/context/data-context';

export default function ProductTable() {
  const { products: initialProducts, setProducts, settings } = useContext(DataContext);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const lowStockThreshold = settings.estoque.estoque_minimo_padrao;

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

  const categories = useMemo(() => 
    ['all', ...Array.from(new Set(initialProducts.map(p => p.category)))]
  , [initialProducts]);

  const filteredProducts = useMemo(() => {
    let products = initialProducts
      .filter(
        (product) =>
          (product.name.toLowerCase().includes(filter.toLowerCase()) ||
          product.barcode.includes(filter)) &&
          (categoryFilter === 'all' || product.category === categoryFilter)
      );

      switch (sortOrder) {
        case 'quantity-asc':
          products.sort((a,b) => a.quantity - b.quantity);
          break;
        case 'quantity-desc':
          products.sort((a,b) => b.quantity - a.quantity);
          break;
        case 'name-asc':
        default:
          products.sort((a,b) => a.name.localeCompare(b.name));
          break;
      }
    
    return products;
  }, [initialProducts, filter, categoryFilter, sortOrder]);

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
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
                <div className="flex flex-wrap w-full sm:w-auto gap-3">
                  <div className="relative w-full sm:w-auto sm:max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                          placeholder="Filtrar por nome ou código..."
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="pl-9"
                      />
                  </div>
                   <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                           <SelectItem key={cat} value={cat}>{cat === 'all' ? 'Todas as Categorias' : cat}</SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                        <SelectItem value="quantity-asc">Quantidade (Baixa)</SelectItem>
                        <SelectItem value="quantity-desc">Quantidade (Alta)</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddProduct} className="w-full sm:w-auto mt-4 sm:mt-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
            </div>
            <div className="rounded-md border">
                <div className="overflow-x-auto">
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
                        {filteredProducts.map((product, index) => (
                        <TableRow key={product.id} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
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
                            <TableCell className="text-center">
                               <Badge variant={product.quantity <= lowStockThreshold ? (product.quantity === 0 ? "destructive" : "secondary") : "outline"} className="gap-1">
                                    {product.quantity <= lowStockThreshold && (
                                        <TriangleAlert className="h-3 w-3" />
                                    )}
                                    {product.quantity}
                                </Badge>
                            </TableCell>
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
