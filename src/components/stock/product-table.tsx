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
import { MoreHorizontal, Pencil, PlusCircle, Trash2, Search, Image as ImageIcon, TriangleAlert, FileUp, Sparkles } from 'lucide-react';
import { ProductForm } from './product-form';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataContext } from '@/context/data-context';
import { useTranslation } from '@/providers/translation-provider';
import { AutomatedStockEntrySheet } from './automated-stock-entry';
import { Checkbox } from '@/components/ui/checkbox';
import { findProductImage } from '@/ai/flows/find-product-image';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';


export default function ProductTable() {
  const { products: initialProducts, setProducts, settings } = useContext(DataContext);
  const { t, formatCurrency } = useTranslation();
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [imageFilter, setImageFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('name-asc');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAutomatedSheetOpen, setIsAutomatedSheetOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isFindingImages, setIsFindingImages] = useState(false);
  const { toast } = useToast();
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

      if (imageFilter === 'with-image') {
          products = products.filter(p => p.imageUrl);
      } else if (imageFilter === 'without-image') {
          products = products.filter(p => !p.imageUrl);
      }

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
  }, [initialProducts, filter, categoryFilter, sortOrder, imageFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };
  
  const handleFindImages = async () => {
    if (selectedProducts.length === 0) {
        toast({
            variant: 'destructive',
            title: "Nenhum produto selecionado",
            description: "Por favor, selecione os produtos para os quais deseja encontrar imagens.",
        });
        return;
    }
    setIsFindingImages(true);
    
    let updatedProductsList = [...initialProducts];

    for (const productId of selectedProducts) {
        const product = initialProducts.find(p => p.id === productId);
        if (product) {
            try {
                const result = await findProductImage({ productName: product.name });
                updatedProductsList = updatedProductsList.map(p => 
                    p.id === productId ? { ...p, imageUrl: result.imageUrl } : p
                );
            } catch (error) {
                console.error(`Error finding image for ${product.name}:`, error);
                // Optionally, notify user about specific failures
            }
        }
    }
    
    setProducts(updatedProductsList);

    setIsFindingImages(false);
    setSelectedProducts([]);
    toast({
        title: "Busca de Imagens Concluída",
        description: `As imagens para ${selectedProducts.length} produtos foram atualizadas.`,
    });
  }

  const allSelected = selectedProducts.length > 0 && selectedProducts.length === filteredProducts.length;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('stock.title')}</CardTitle>
          <CardDescription>
            {t('stock.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
                <div className="flex flex-wrap w-full sm:w-auto gap-3">
                  <div className="relative w-full sm:w-auto sm:max-w-xs">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                          placeholder={t('stock.filter_placeholder')}
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          className="pl-9"
                      />
                  </div>
                   <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder={t('stock.category')} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                           <SelectItem key={cat} value={cat}>{cat === 'all' ? t('stock.all_categories') : cat}</SelectItem>
                        ))}
                      </SelectContent>
                  </Select>
                  <Select value={imageFilter} onValueChange={setImageFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filtrar por imagem" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="with-image">Com Imagem</SelectItem>
                        <SelectItem value="without-image">Sem Imagem</SelectItem>
                      </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder={t('stock.sort_by')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name-asc">{t('stock.sort_name_asc')}</SelectItem>
                        <SelectItem value="quantity-asc">{t('stock.sort_quantity_asc')}</SelectItem>
                        <SelectItem value="quantity-desc">{t('stock.sort_quantity_desc')}</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                    <Button onClick={() => setIsAutomatedSheetOpen(true)} variant="outline" className="w-full sm:w-auto mt-4 sm:mt-0">
                      <FileUp className="mr-2 h-4 w-4" />
                      {t('stock.ai_entry')}
                    </Button>
                    <Button onClick={handleAddProduct} className="w-full sm:w-auto mt-4 sm:mt-0">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t('stock.add_product')}
                    </Button>
                </div>
            </div>

            {selectedProducts.length > 0 && (
                <div className="flex items-center gap-4 mb-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">{selectedProducts.length} produto(s) selecionado(s)</p>
                    <Button size="sm" onClick={handleFindImages} disabled={isFindingImages}>
                        {isFindingImages ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Buscar Imagens com IA
                    </Button>
                </div>
            )}

            <div className="rounded-xl border overflow-hidden">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-12 pl-4">
                           <Checkbox
                            checked={allSelected}
                            onCheckedChange={handleSelectAll}
                            aria-label="Selecionar todos"
                           />
                        </TableHead>
                        <TableHead className="w-20">{t('stock.image')}</TableHead>
                        <TableHead>{t('stock.product_name')}</TableHead>
                        <TableHead>{t('stock.category')}</TableHead>
                        <TableHead className="text-center">{t('stock.quantity')}</TableHead>
                        <TableHead className="text-right">{t('stock.purchase_price')}</TableHead>
                        <TableHead className="text-right">{t('stock.sale_price')}</TableHead>
                        <TableHead>{t('stock.barcode')}</TableHead>
                        <TableHead className="w-16 pr-4">
                            <span className="sr-only">{t('global.actions')}</span>
                        </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.map((product) => (
                        <TableRow key={product.id} data-state={selectedProducts.includes(product.id) ? "selected" : ""}>
                            <TableCell className="pl-4">
                                <Checkbox
                                    checked={selectedProducts.includes(product.id)}
                                    onCheckedChange={(checked) => handleSelectProduct(product.id, !!checked)}
                                    aria-label={`Selecionar ${product.name}`}
                                />
                            </TableCell>
                            <TableCell className="p-2">
                            <div className="flex items-center justify-center h-10 w-10 bg-muted rounded-md overflow-hidden border">
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
                            <TableCell className="text-muted-foreground">{product.category}</TableCell>
                            <TableCell className="text-center">
                               <Badge variant={product.quantity <= lowStockThreshold ? (product.quantity === 0 ? "destructive" : "warning") : "info"} className="gap-1">
                                    {product.quantity <= lowStockThreshold && (
                                        <TriangleAlert className="h-3 w-3" />
                                    )}
                                    {product.quantity}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right text-muted-foreground">{formatCurrency(product.purchasePrice)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(product.salePrice)}</TableCell>
                            <TableCell className="text-muted-foreground">{product.barcode}</TableCell>
                            <TableCell className="pr-4">
                            <div className="flex justify-end">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Button aria-haspopup="true" size="icon" variant="ghost">
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
                                <TableCell colSpan={9} className="h-24 text-center">
                                    {t('stock.no_products_found')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
            </div>
        </CardContent>
        <CardFooter>
            <div className="text-sm text-muted-foreground">
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
      <AutomatedStockEntrySheet 
        open={isAutomatedSheetOpen}
        onOpenChange={setIsAutomatedSheetOpen}
      />
    </>
  );
}
