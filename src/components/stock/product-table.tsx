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
import { useTranslation } from '@/providers/translation-provider';

export default function ProductTable() {
  const { products: initialProducts, setProducts, settings } = useContext(DataContext);
  const { t } = useTranslation();
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
          <CardTitle className="text-xl font-bold text-gray-800">{t('stock.title')}</CardTitle>
          <CardDescription className="text-base text-gray-600">
            {t('stock.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
                <div className="flex flex-wrap w-full sm:w-auto gap-3">
                  <div className="relative w-full sm:w-auto sm:max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                          placeholder={t('stock.filter_placeholder')}
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="pl-9 bg-white border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500"
                      />
                  </div>
                   <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-300">
                        <SelectValue placeholder={t('stock.category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                           <SelectItem key={cat} value={cat}>{cat === 'all' ? t('stock.all_categories') : cat}</SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-full sm:w-[180px] bg-white border-gray-300">
                        <SelectValue placeholder={t('stock.sort_by')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">{t('stock.sort_name_asc')}</SelectItem>
                        <SelectItem value="quantity-asc">{t('stock.sort_quantity_asc')}</SelectItem>
                        <SelectItem value="quantity-desc">{t('stock.sort_quantity_desc')}</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddProduct} className="w-full sm:w-auto mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('stock.add_product')}
                </Button>
            </div>
            <div className="rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                        <TableHead className="w-[80px] px-4 py-3 text-sm font-medium text-gray-600">Image</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-600">Nome</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-600">{t('stock.category')}</TableHead>
                        <TableHead className="text-center px-4 py-3 text-sm font-medium text-gray-600">{t('stock.quantity')}</TableHead>
                        <TableHead className="text-right px-4 py-3 text-sm font-medium text-gray-600">{t('stock.purchase_price')}</TableHead>
                        <TableHead className="text-right px-4 py-3 text-sm font-medium text-gray-600">{t('stock.sale_price')}</TableHead>
                        <TableHead className="px-4 py-3 text-sm font-medium text-gray-600">{t('stock.barcode')}</TableHead>
                        <TableHead>
                            <span className="sr-only">{t('global.actions')}</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product, index) => (
                        <TableRow key={product.id} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition border-b-0">
                            <TableCell className="p-2">
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
                            <TableCell className="font-medium px-4 py-3 text-gray-800">{product.name}</TableCell>
                            <TableCell className="px-4 py-3 text-gray-700">{product.category}</TableCell>
                            <TableCell className="text-center px-4 py-3">
                               <Badge variant={product.quantity <= lowStockThreshold ? (product.quantity === 0 ? "destructive" : "warning") : "info"} className="gap-1">
                                    {product.quantity <= lowStockThreshold && (
                                        <TriangleAlert className="h-3 w-3" />
                                    )}
                                    {product.quantity}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right px-4 py-3 text-gray-700">R$ {product.purchasePrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right px-4 py-3 font-medium text-gray-800">R$ {product.salePrice.toFixed(2)}</TableCell>
                            <TableCell className="px-4 py-3 text-gray-700">{product.barcode}</TableCell>
                            <TableCell className="px-4 py-3">
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost" className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>{t('global.actions')}</DropdownMenuLabel>
                                    <DropdownMenuItem onSelect={() => handleEditProduct(product)}>
                                        <Pencil className="mr-2 h-4 w-4" /> {t('global.edit')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onSelect={() => handleDeleteProduct(product.id)} className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" /> {t('global.delete')}
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
                                    {t('stock.no_products_found')}
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
                {t('stock.showing_products', { count: filteredProducts.length, total: initialProducts.length })}
            </div>
        </CardFooter>
      </Card>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingProduct ? t('stock.edit_product') : t('stock.add_new_product')}</SheetTitle>
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

    