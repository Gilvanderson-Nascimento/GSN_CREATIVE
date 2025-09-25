'use client';
import { useState, useContext, useEffect } from 'react';
import Image from 'next/image';
import type { Product, SaleItem, Customer, Sale } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { X, Plus, Minus, Percent, ShoppingCart, UserPlus, CheckCircle, Image as ImageIcon, Save, Printer, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DataContext } from '@/context/data-context';
import { useAuth } from '@/hooks/use-auth';
import { useTranslation } from '@/providers/translation-provider';
import { format } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';

type PosSystemProps = {
  isEditing?: boolean;
  existingSale?: Sale;
  onSave?: (data: {
    items: SaleItem[];
    subtotal: number;
    discount: number;
    total: number;
    customerId?: string;
  }) => void;
};


export default function PosSystem({ isEditing = false, existingSale, onSave }: PosSystemProps) {
  const { products, customers, completeSale, settings } = useContext(DataContext);
  const { user } = useAuth();
  const { t, language, formatCurrency } = useTranslation();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | undefined>(undefined);
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();
  const [lastCompletedSale, setLastCompletedSale] = useState<Sale | null>(null);
  const locale = language === 'pt-BR' ? ptBR : enUS;
  
  useEffect(() => {
    if (isEditing && existingSale) {
      setCart(existingSale.items);
      setDiscount(existingSale.discount);
      setSelectedCustomer(existingSale.customerId);
    }
  }, [isEditing, existingSale]);


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleBarcodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.length > 3) {
      const foundProduct = products.find(p => p.barcode === searchQuery);
      if (foundProduct) {
        addToCart(foundProduct);
        setSearchQuery(''); // Clear search after adding
      } else {
        toast({
            variant: "destructive",
            title: t('stock.barcode_not_found_title'),
            description: t('stock.barcode_not_found_description', { barcode: searchQuery }),
        })
      }
    }
  }

  const searchedProducts = searchQuery
    ? products.filter(
        (p) =>
          (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.barcode.includes(searchQuery)) && p.quantity > 0
      )
    : products.filter(p => p.quantity > 0);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.productId === product.id);
    
    if (!isEditing) {
        const productInStock = products.find(p => p.id === product.id);
        if (!productInStock || productInStock.quantity <= (existingItem?.quantity || 0)) {
            toast({
                variant: "destructive",
                title: t('sales.product_out_of_stock_title'),
                description: t('sales.product_out_of_stock_description'),
            });
            return;
        }
    }


    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.salePrice,
          totalPrice: product.salePrice,
        },
      ]);
    }
  };
  
  const updateQuantity = (productId: string, amount: number) => {
      if (!isEditing) {
          const existingItem = cart.find((item) => item.productId === productId);
          const productInStock = products.find(p => p.id === productId);
          if (amount > 0) {
              if (!productInStock || productInStock.quantity <= (existingItem?.quantity || 0)) {
                  toast({
                      variant: "destructive",
                      title: t('sales.product_out_of_stock_title'),
                      description: t('sales.product_out_of_stock_description'),
                  });
                  return;
              }
          }
      }

      setCart(cart.map(item => {
          if (item.productId === productId) {
              const newQuantity = item.quantity + amount;
              return newQuantity > 0 ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice } : null;
          }
          return item;
      }).filter((item): item is SaleItem => item !== null));
  }

  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const total = subtotal - (subtotal * (discount / 100));

  const handleCompleteSale = () => {
    if (cart.length === 0) {
        toast({
            variant: "destructive",
            title: t('sales.empty_cart_title'),
            description: t('sales.empty_cart_description'),
        });
        return;
    }
   
    const salePayload = {
      items: cart,
      customerId: selectedCustomer,
      subtotal,
      discount,
      total,
      sellerId: settings.vendas.associar_vendedor && user ? user.id : undefined,
      sellerName: settings.vendas.associar_vendedor && user ? user.name : undefined,
    };
    
    if (isEditing && onSave) {
        onSave(salePayload);
         toast({
          title: t('sales.sale_update_success_title'),
          description: t('sales.sale_update_success_description', { total: formatCurrency(total) }),
        });
    } else {
        const newSale = completeSale(salePayload);
        setLastCompletedSale(newSale); // Open the dialog
        
        // Reset state for next sale
        setCart([]);
        setDiscount(0);
        setSelectedCustomer(undefined);
    }
  }

  const closeSaleDialog = () => {
    setLastCompletedSale(null);
  }

  const handlePrintReceipt = () => {
    if (!lastCompletedSale) return;
    const saleCustomer = customers.find(c => c.id === lastCompletedSale.customerId);

    const printWindow = window.open('', '', 'height=600,width=800');
    if (printWindow) {
      printWindow.document.write('<html><head><title>Recibo</title>');
      printWindow.document.write('<style>body{font-family: sans-serif; margin: 2rem;} table{width: 100%; border-collapse: collapse;} th,td{border: 1px solid #ddd; padding: 8px;} h1,h2,h3{text-align: center;} .total{font-weight: bold;}</style>');
      printWindow.document.write('</head><body>');
      printWindow.document.write(`<h1>${settings.sistema.nome_empresa}</h1>`);
      printWindow.document.write(`<h2>${t('sales.receipt_title')}</h2>`);
      printWindow.document.write(`<p><strong>${t('sales.sale_id')}:</strong> ${lastCompletedSale.id}</p>`);
      printWindow.document.write(`<p><strong>${t('sales.date')}:</strong> ${format(new Date(lastCompletedSale.date), 'Pp', { locale })}</p>`);
      if(saleCustomer) printWindow.document.write(`<p><strong>${t('sales.customer')}:</strong> ${saleCustomer.name}</p>`);
      if(lastCompletedSale.sellerName) printWindow.document.write(`<p><strong>${t('sales.seller')}:</strong> ${lastCompletedSale.sellerName}</p>`);
      
      printWindow.document.write('<table><thead><tr>');
      printWindow.document.write(`<th>${t('sales.receipt_product')}</th><th>${t('sales.receipt_qty')}</th><th>${t('sales.receipt_unit_price')}</th><th>${t('sales.receipt_total')}</th>`);
      printWindow.document.write('</tr></thead><tbody>');
      lastCompletedSale.items.forEach(item => {
        printWindow.document.write(`<tr><td>${item.productName}</td><td>${item.quantity}</td><td>${formatCurrency(item.unitPrice)}</td><td>${formatCurrency(item.totalPrice)}</td></tr>`);
      });
      printWindow.document.write('</tbody></table>');

      printWindow.document.write(`<p><strong>${t('sales.subtotal')}:</strong> ${formatCurrency(lastCompletedSale.subtotal)}</p>`);
      printWindow.document.write(`<p><strong>${t('sales.discount')}:</strong> ${lastCompletedSale.discount}%</p>`);
      printWindow.document.write(`<h3 class="total">${t('sales.total')}: ${formatCurrency(lastCompletedSale.total)}</h3>`);

      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleGenerateInvoice = () => {
    toast({
        title: "Funcionalidade em desenvolvimento",
        description: "A geração de Nota Fiscal Eletrônica (NF-e) será implementada em breve."
    })
  }

  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-10rem)]">
      <Card className="lg:col-span-3 flex flex-col h-full overflow-hidden">
        <CardHeader className="p-4">
            <form onSubmit={handleBarcodeSubmit}>
                <Input 
                placeholder={t('sales.search_placeholder')} 
                value={searchQuery}
                onChange={handleSearchChange} 
                />
            </form>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pr-6">
              {searchedProducts.map((product) => (
                <Card 
                  key={product.id} 
                  className="cursor-pointer p-0 overflow-hidden flex flex-col items-center justify-between transition hover:shadow-lg hover:ring-2 hover:ring-primary" 
                  onClick={() => addToCart(product)}
                >
                  <div className="w-full h-24 bg-muted flex items-center justify-center">
                      {product.imageUrl ? (
                           <Image 
                              src={product.imageUrl} 
                              alt={product.name} 
                              width={150} 
                              height={150} 
                              className="w-full h-full object-cover"
                              data-ai-hint="product image"
                          />
                      ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground"/>
                      )}
                  </div>
                  <div className="p-2 text-center w-full">
                    <p className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{t('stock.quantity')}: {product.quantity}</p>
                    <p className="text-primary font-bold text-base mt-2">{formatCurrency(product.salePrice)}</p>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="lg:col-span-1 flex flex-col p-0 h-full overflow-hidden">
        <CardHeader className="p-6">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            {t('sales.shopping_cart')}
          </CardTitle>
        </CardHeader>
        <div className="flex-grow overflow-hidden p-6 pt-0">
             <ScrollArea className="h-full pr-4 -mr-4">
                {cart.length === 0 ? (
                    <div className="text-center text-muted-foreground italic h-full flex items-center justify-center">
                        {t('sales.empty_cart_message')}
                    </div>
                ) : (
                    <div className="space-y-2">
                    {cart.map((item) => (
                        <div key={item.productId} className="flex items-center text-sm">
                        <div className="flex-grow">
                            <p className="font-medium leading-tight line-clamp-2">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">{formatCurrency(item.unitPrice)} x {item.quantity}</p>
                        </div>
                        <div className="ml-4 flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => updateQuantity(item.productId, -1)}><Minus className="h-4 w-4"/></Button>
                            <span className="font-medium w-4 text-center">{item.quantity}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => updateQuantity(item.productId, 1)}><Plus className="h-4 w-4"/></Button>
                            <div className="font-bold w-14 text-right">{formatCurrency(item.totalPrice)}</div>
                        </div>
                        </div>
                    ))}
                    </div>
                )}
            </ScrollArea>
        </div>
        <div className="flex flex-col gap-4 p-6 pt-2 border-t mt-auto">
            <div className="w-full">
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                    <SelectTrigger>
                        <SelectValue placeholder={<div className="flex items-center gap-2"><UserPlus className="h-4 w-4"/>{t('sales.associate_customer')}</div>} />
                    </SelectTrigger>
                    <SelectContent>
                        {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full flex items-center">
                <Input 
                    type="number" 
                    placeholder={t('sales.discount_percent')}
                    className="rounded-r-none" 
                    value={discount || ''}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                />
                <span className="p-2.5 inline-flex items-center justify-center rounded-r-md border border-l-0 bg-muted">
                    <Percent className="h-4 w-4 text-muted-foreground"/>
                </span>
            </div>

            <Separator className="my-2" />
            <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                <span>{t('sales.subtotal')}</span>
                <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                <span>{t('sales.discount')}</span>
                <span>- {formatCurrency(subtotal - total)} ({discount}%)</span>
                </div>
                <div className="flex justify-between font-bold text-xl">
                <span>{t('sales.total')}</span>
                <span>{formatCurrency(total)}</span>
                </div>
            </div>
            <Button size="lg" className="w-full" onClick={handleCompleteSale}>
                {isEditing ? (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('sales.update_sale')}
                    </>
                ) : (
                    t('sales.complete_sale')
                )}
            </Button>
        </div>
      </Card>
    </div>

    <Dialog open={!!lastCompletedSale} onOpenChange={(isOpen) => !isOpen && closeSaleDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500"/>
                {t('sales.sale_success_title')}
            </DialogTitle>
            <DialogDescription>
                Venda <strong>{lastCompletedSale?.id}</strong> finalizada com o total de <strong>{formatCurrency(lastCompletedSale?.total || 0)}</strong>. O que você gostaria de fazer agora?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center gap-2 pt-4">
            <Button variant="outline" onClick={handlePrintReceipt}>
                <Printer className="mr-2 h-4 w-4"/>
                Gerar Recibo
            </Button>
            <Button onClick={handleGenerateInvoice}>
                <FileText className="mr-2 h-4 w-4"/>
                Gerar Nota Fiscal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
