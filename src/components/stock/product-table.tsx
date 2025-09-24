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
      <Card className="bg-white shadow-md rounded-xl">
        <CardHeader className="p-6">
          <CardTitle className="text-xl font-bold text-gray-800">Gerenciamento de Estoque</CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Visualize, adicione, edite e exclua os produtos do seu estabelecimento.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
                <div className="flex flex-wrap w-full sm:w-auto gap-3">
                  <div className="relative w-full sm:w-auto sm:max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                          placeholder="Filtrar por nome ou código..."
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="pl-9 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                   <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                           <SelectItem key={cat} value={cat}>{cat === 'all' ? 'Todas as Categorias' : cat}</SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                        <SelectItem value="quantity-asc">Quantidade (Baixa)</SelectItem>
                        <SelectItem value="quantity-desc">Quantidade (Alta)</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddProduct} className="w-full sm:w-auto mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Adicionar Produto
                </Button>
            </div>
            <div className="rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[80px] text-sm text-gray-600 font-medium px-4">Imagem</TableHead>
                        <TableHead className="text-sm text-gray-600 font-medium px-4">Nome</TableHead>
                        <TableHead className="text-sm text-gray-600 font-medium px-4">Categoria</TableHead>
                        <TableHead className="text-center text-sm text-gray-600 font-medium px-4">Qtde.</TableHead>
                        <TableHead className="text-right text-sm text-gray-600 font-medium px-4">Vl. Compra</TableHead>
                        <TableHead className="text-right text-sm text-gray-600 font-medium px-4">Vl. Venda</TableHead>
                        <TableHead className="text-sm text-gray-600 font-medium px-4">Cód. Barras</TableHead>
                        <TableHead>
                            <span className="sr-only">Ações</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product, index) => (
                        <TableRow key={product.id} className="transition hover:bg-gray-50 border-b border-gray-200">
                            <TableCell className="p-4">
                            <div className="flex items-center justify-center h-10 w-10 bg-gray-50 rounded-md overflow-hidden">
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
                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                            </TableCell>
                            <TableCell className="font-medium text-gray-800 text-sm px-4">{product.name}</TableCell>
                            <TableCell className="text-sm text-gray-700 px-4">{product.category}</TableCell>
                            <TableCell className="text-center px-4">
                               <Badge variant={product.quantity <= lowStockThreshold ? (product.quantity === 0 ? "destructive" : "warning") : "info"} className="gap-1">
                                    {product.quantity <= lowStockThreshold && (
                                        <TriangleAlert className="h-3 w-3" />
                                    )}
                                    {product.quantity}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-sm text-gray-700 px-4">R$ {product.purchasePrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-sm text-gray-700 px-4">R$ {product.salePrice.toFixed(2)}</TableCell>
                            <TableCell className="text-sm text-gray-700 px-4">{product.barcode}</TableCell>
                            <TableCell className="px-4">
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost" className="text-gray-400 hover:text-gray-600">
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
                                <TableCell colSpan={8} className="h-24 text-center text-sm text-gray-500">
                                    Nenhum produto encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
            </div>
        </CardContent>
        <CardFooter className="p-6">
            <div className="text-sm text-gray-500">
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
